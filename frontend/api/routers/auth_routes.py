from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from typing import Optional
from api.database import create_user, authenticate_user, get_user_by_token, delete_token

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

def get_current_user(authorization: Optional[str] = Header(None)):
    """Extracts bearer token and validates current authenticated user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header.")
    parts = authorization.split(" ")
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format. Expected 'Bearer <token>'.")
    token = parts[1]
    user = get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Session expired or invalid token. Please log in again.")
    return user

@router.post("/register")
def register(req: RegisterRequest):
    """Registers a new user account."""
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long.")
    try:
        user = create_user(req.name, req.email, req.password)
        auth_data = authenticate_user(req.email, req.password)
        if not auth_data:
            raise HTTPException(status_code=400, detail="Account created, but initial session generation failed. Please sign in.")
        return {
            "status": "success",
            "message": "User registered successfully.",
            "token": auth_data["token"],
            "user": auth_data["user"]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Registration error: {str(e)}")

@router.post("/login")
def login(req: LoginRequest):
    """Logs in an existing user and returns an authentication token."""
    auth_data = authenticate_user(req.email, req.password)
    if not auth_data:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    return {
        "status": "success",
        "token": auth_data["token"],
        "user": auth_data["user"]
    }

@router.get("/me")
def me(current_user: dict = Depends(get_current_user)):
    """Returns the current authenticated user's profile."""
    return {"user": current_user}

@router.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    """Invalidates the user's active session token."""
    if authorization and " " in authorization:
        token = authorization.split(" ")[1]
        delete_token(token)
    return {"status": "success", "message": "Logged out successfully."}
