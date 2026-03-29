from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.utils.database import get_db
from app.utils.auth import get_current_user_optional
from app.models.models import Summary, User

router = APIRouter()


class SummaryItem(BaseModel):
    id: int
    input_type: str
    original_input: str
    summary: List[str]
    category: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/history", response_model=List[SummaryItem])
def get_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(Summary)

    if current_user:
        query = query.filter(Summary.user_id == current_user.id)
    else:
        # Anonymous: return recent public (no user) summaries
        query = query.filter(Summary.user_id == None)

    if category:
        query = query.filter(Summary.category == category)

    summaries = query.order_by(Summary.created_at.desc()).offset(skip).limit(limit).all()

    return [
        SummaryItem(
            id=s.id,
            input_type=s.input_type,
            original_input=s.original_input,
            summary=s.summary.split("\n"),
            category=s.category,
            created_at=s.created_at
        )
        for s in summaries
    ]


@router.delete("/history/{summary_id}")
def delete_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user_optional)
):
    summary = db.query(Summary).filter(Summary.id == summary_id).first()
    if not summary:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Summary not found")
    db.delete(summary)
    db.commit()
    return {"message": "Deleted successfully"}
