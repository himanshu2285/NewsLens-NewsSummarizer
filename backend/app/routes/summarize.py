from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, HttpUrl
from sqlalchemy.orm import Session
from typing import Optional, List
from app.utils.database import get_db
from app.utils.auth import get_current_user_optional
from app.models.models import User, Summary
from app.services.scraper import scrape_article
from app.services.ai_service import summarize_and_classify

router = APIRouter()


class SummarizeRequest(BaseModel):
    text: Optional[str] = None
    url: Optional[str] = None


class SummarizeResponse(BaseModel):
    id: int
    summary: List[str]
    category: str
    input_type: str


@router.post("/summarize", response_model=SummarizeResponse)
def summarize(
    request: SummarizeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    if not request.text and not request.url:
        raise HTTPException(status_code=400, detail="Provide either 'text' or 'url'.")

    if request.url and request.text:
        raise HTTPException(status_code=400, detail="Provide only one of 'text' or 'url', not both.")

    # Determine input type and get article text
    if request.url:
        input_type = "url"
        original_input = request.url
        try:
            article_text = scrape_article(request.url)
        except ValueError as e:
            raise HTTPException(status_code=422, detail=str(e))
    else:
        input_type = "text"
        original_input = request.text
        article_text = request.text.strip()
        if len(article_text) < 50:
            raise HTTPException(status_code=400, detail="Text is too short to summarize (minimum 50 chars).")

    # Call AI
    try:
        ai_result = summarize_and_classify(article_text)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"AI processing failed: {str(e)}")

    # Persist to DB
    summary_obj = Summary(
        input_type=input_type,
        original_input=original_input,
        article_text=article_text,
        summary="\n".join(ai_result["summary"]),
        category=ai_result["category"],
        user_id=current_user.id if current_user else None
    )
    db.add(summary_obj)
    db.commit()
    db.refresh(summary_obj)

    return SummarizeResponse(
        id=summary_obj.id,
        summary=ai_result["summary"],
        category=ai_result["category"],
        input_type=input_type
    )
