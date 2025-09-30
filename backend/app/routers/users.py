from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["users"])

class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        orm_mode = True

@router.get("/", response_model=List[UserOut])
def get_users(search: str = Query(default=""), db: Session = Depends(get_db)):
    query = db.query(User)
    if search:
        query = query.filter(User.username.ilike(f"%{search}%"))
    return query.all()
