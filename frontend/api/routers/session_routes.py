from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from api.routers.auth_routes import get_current_user
from api.database import (
    create_session, get_user_sessions, get_session_details,
    get_user_analytics, complete_session, save_exam_result,
    save_concepts, save_questions
)

router = APIRouter(prefix="/api/sessions", tags=["Sessions"])

class CreateSessionRequest(BaseModel):
    title: str
    subject: Optional[str] = "General"
    material_name: Optional[str] = ""

class CompleteSessionRequest(BaseModel):
    session_id: str
    baseline_score: float
    final_score: float
    tes_score: float

class RecordAnswerRequest(BaseModel):
    session_id: str
    question_id: str
    exam_type: str # 'baseline' or 'final'
    child_answer: str
    score: float
    feedback: str

@router.post("/create")
def start_session(req: CreateSessionRequest, user: dict = Depends(get_current_user)):
    """Initializes a new study session for the authenticated user."""
    session_id = create_session(
        user_id=user["id"],
        title=req.title,
        subject=req.subject or "General",
        material_name=req.material_name or ""
    )
    return {
        "status": "success",
        "session_id": session_id,
        "title": req.title,
        "subject": req.subject
    }

@router.get("/history")
def list_history(user: dict = Depends(get_current_user)):
    """Fetches all past learning sessions for the user."""
    sessions = get_user_sessions(user["id"])
    return {"sessions": sessions}

@router.get("/analytics")
def get_analytics(user: dict = Depends(get_current_user)):
    """Fetches user analytics KPIs for the dashboard."""
    analytics = get_user_analytics(user["id"])
    return {"analytics": analytics}

@router.get("/{session_id}")
def get_session(session_id: str, user: dict = Depends(get_current_user)):
    """Fetches full breakdown of a specific session."""
    session = get_session_details(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")
    if session["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Unauthorized access to this session.")
    return {"session": session}

@router.post("/complete")
def finalize_session(req: CompleteSessionRequest, user: dict = Depends(get_current_user)):
    """Marks a session as completed with final scores."""
    complete_session(
        session_id=req.session_id,
        baseline_score=req.baseline_score,
        final_score=req.final_score,
        tes_score=req.tes_score
    )
    return {"status": "success", "message": "Session completed and saved."}

@router.post("/record-result")
def record_result(req: RecordAnswerRequest, user: dict = Depends(get_current_user)):
    """Records an individual question response and score into the database."""
    save_exam_result(
        session_id=req.session_id,
        question_id=req.question_id,
        exam_type=req.exam_type,
        child_answer=req.child_answer,
        score=req.score,
        feedback=req.feedback
    )
    return {"status": "success"}
