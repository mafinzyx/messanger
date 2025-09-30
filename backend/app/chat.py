from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Message, Attachment
from pydantic import BaseModel
from app.routers.auth import get_current_user
from typing import List
import uuid, os
from datetime import datetime

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/chat", tags=["chat"])

class MessageCreate(BaseModel):
    receiver_id: int
    content: str


# Users search
@router.get("/users")
def search_users(query: str = "", db: Session = Depends(get_db)):
    users = db.query(User).filter(User.username.ilike(f"%{query}%")).all()
    return [{"id": u.id, "username": u.username, "email": u.email} for u in users]


# Send message with optional attachments
@router.post("/send")
async def send_message(
    receiver_id: int = Form(...),
    content: str = Form(""),
    files: List[UploadFile] = File(default=[]),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    new_msg = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content,
        timestamp=datetime.utcnow()
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)

    for f in files:
        stored_name = f"{uuid.uuid4().hex}_{f.filename}"
        path = os.path.join(UPLOAD_DIR, stored_name)
        with open(path, "wb") as buffer:
            buffer.write(await f.read())

        attach = Attachment(
            message_id=new_msg.id,
            filename=f.filename,
            stored_name=stored_name,
            content_type=f.content_type,
            size=len(open(path, "rb").read())
        )
        db.add(attach)

    db.commit()
    return {"msg": "Message sent", "id": new_msg.id}


@router.put("/messages/{msg_id}")
def edit_message(
    msg_id: int,
    content: str = Form(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    msg = db.query(Message).filter_by(id=msg_id, sender_id=current_user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found or not yours")

    msg.content = content
    db.commit()
    return {"msg": "Message updated"}


@router.delete("/messages/{msg_id}")
def delete_message(
    msg_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    msg = db.query(Message).filter_by(id=msg_id, sender_id=current_user.id).first()
    if not msg:
        raise HTTPException(status_code=404, detail="Message not found or not yours")

    db.delete(msg)
    db.commit()
    return {"msg": "Message deleted"}


# Get messages history with attachments
@router.get("/messages/{user_id}")
def get_messages(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    msgs = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.timestamp.asc()).all()

    return [
        {
            "id": m.id,
            "from_id": m.sender_id,
            "from_username": m.sender.username,
            "to_id": m.receiver_id,
            "content": m.content,
            "timestamp": m.timestamp.isoformat(),
            "attachments": [
                {
                    "id": a.id,
                    "filename": a.filename,
                    "url": f"/files/{a.stored_name}"
                }
                for a in m.attachments
            ]
        } for m in msgs
    ]