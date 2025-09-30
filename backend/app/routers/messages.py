from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Message
from app.routers.auth import get_current_user
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["messages"])

@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return {"id": current_user.id, "username": current_user.username, "email": current_user.email}

@router.post("/{receiver_id}")
def send_message(receiver_id: int, content: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    new_msg = Message(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        content=content,
        timestamp=datetime.utcnow()
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return {"msg": "Message sent", "id": new_msg.id}


# get messages history 
@router.get("/{user_id}")
def get_messages(user_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    msgs = db.query(Message).filter(
        ((Message.sender_id == current_user.id) & (Message.receiver_id == user_id)) |
        ((Message.sender_id == user_id) & (Message.receiver_id == current_user.id))
    ).order_by(Message.timestamp.asc()).all()

    return [
        {
            "from": m.sender_id,
            "to": m.receiver_id,
            "content": m.content,
            "time": m.timestamp
        }
        for m in msgs
    ]
