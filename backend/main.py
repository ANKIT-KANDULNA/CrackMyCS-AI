from dotenv import load_dotenv
import os

# Load environment variables before importing modules that depend on them
load_dotenv()

from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any
from sqlalchemy.orm import Session

from rag_chain import get_response
from mock_responses import get_mock_response
from database import init_db, get_db
from models import User, ChatSession, ChatMessage
from auth import create_access_token, get_current_user, get_current_user_optional, hash_password, verify_password

AUTH_CALLBACK_SECRET = os.getenv("AUTH_CALLBACK_SECRET", "dev-auth-secret-change-in-production")

app = FastAPI(title="CrackMyCS AI Backend")

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# CORS: In production, set ALLOWED_ORIGINS env var to your Vercel frontend URL
# e.g. ALLOWED_ORIGINS=https://crackmycs.vercel.app,https://crackmycs.ai
# Leave unset (or set to "*") for local development to allow all origins.
_raw_origins = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = (
    [o.strip() for o in _raw_origins.split(",") if o.strip()]
    if _raw_origins != "*"
    else ["*"]
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    subject: str
    session_id: Optional[int] = None

class CreateChatRequest(BaseModel):
    subject: str
    title: Optional[str] = None

class ChatSessionSummary(BaseModel):
    id: int
    title: str
    subject: str
    created_at: datetime
    updated_at: datetime
    message_count: int

class ChatMessageResponse(BaseModel):
    id: int
    role: str
    content: str
    response_data: Optional[dict[str, Any]] = None
    created_at: datetime

class ChatSessionDetail(BaseModel):
    id: int
    title: str
    subject: str
    created_at: datetime
    updated_at: datetime
    messages: list[ChatMessageResponse]

class OAuthCallbackRequest(BaseModel):
    email: str
    name: str
    provider: str
    provider_id: str
    image_url: str | None = None

class CredentialsRegisterRequest(BaseModel):
    email: str
    name: str
    password: str

class CredentialsLoginRequest(BaseModel):
    email: str
    password: str

class QueryResponse(BaseModel):
    answer: str
    summary: str
    topics: list[str]
    resources: list[dict]
    images: list[dict] = []
    video_links: list[dict] = []
    interview_questions: list[str] = []
    dsa_concepts: list[str]
    sources: list[str] = []
    session_id: int

SUPPORTED_SUBJECTS = [
    "OS", "DBMS", "OOPs", "CN", "System Design", "Software Engineering"
]

def _truncate_title(text: str, max_len: int = 60) -> str:
    cleaned = " ".join(text.strip().split())
    if len(cleaned) <= max_len:
        return cleaned or "New Chat"
    return cleaned[: max_len - 3] + "..."

def _get_user_session(
    session_id: int,
    current_user: User,
    db: Session,
) -> ChatSession:
    session = (
        db.query(ChatSession)
        .filter(
            ChatSession.id == session_id,
            ChatSession.user_id == current_user.id,
        )
        .first()
    )
    if session is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Chat session not found",
        )
    return session

def _create_chat_session(
    db: Session,
    user: User,
    subject: str,
    title: Optional[str] = None,
) -> ChatSession:
    session = ChatSession(
        user_id=user.id,
        subject=subject,
        title=title or "New Chat",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@app.get("/api/health")
def health_check(current_user: Optional[User] = Depends(get_current_user_optional)):
    """Health check endpoint (authentication optional)."""
    return {"status": "ok", "authenticated": current_user is not None}

@app.post("/api/auth/callback")
async def auth_callback(
    request: OAuthCallbackRequest,
    db: Session = Depends(get_db),
    x_auth_secret: Optional[str] = Header(None, alias="X-Auth-Secret"),
):
    """
    Handle OAuth callback from NextAuth.
    Creates or updates user and returns JWT token.
    """
    if not AUTH_CALLBACK_SECRET or x_auth_secret != AUTH_CALLBACK_SECRET:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid auth callback secret",
        )

    user = db.query(User).filter(
        User.provider == request.provider,
        User.provider_id == request.provider_id,
    ).first()

    # Fallback: reuse an existing account that already has this email
    # (e.g. a user who signed up with email/password now logs in via Google).
    if user is None:
        user = db.query(User).filter(User.email == request.email).first()
        if user is not None:
            user.provider = request.provider
            user.provider_id = request.provider_id
            user.password_hash = None
            user.updated_at = datetime.utcnow()

    if user:
        # Update existing user
        user.name = request.name
        user.image_url = request.image_url
        user.provider_id = request.provider_id
        user.updated_at = datetime.utcnow()
    else:
        # Create new user
        user = User(
            email=request.email,
            name=request.name,
            provider=request.provider,
            provider_id=request.provider_id,
            image_url=request.image_url
        )
        db.add(user)
    
    db.commit()
    db.refresh(user)
    
    # Create JWT token using user ID instead of email
    access_token = create_access_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "image_url": user.image_url
        }
    }

@app.post("/api/auth/register")
async def register_credentials(
    request: CredentialsRegisterRequest,
    db: Session = Depends(get_db),
):
    """
    Register a new user with email + password (normal auth).
    Public endpoint — no JWT required.
    """
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with that email already exists.",
        )

    user = User(
        email=request.email,
        name=request.name,
        provider="credentials",
        provider_id=request.email,
        password_hash=hash_password(request.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "image_url": user.image_url,
            "provider": user.provider,
        },
    }

@app.post("/api/auth/login")
async def login_credentials(
    request: CredentialsLoginRequest,
    db: Session = Depends(get_db),
):
    """
    Log in an existing credentials user with email + password.
    Public endpoint — no JWT required.
    """
    user = db.query(User).filter(
        User.email == request.email,
        User.provider == "credentials",
    ).first()

    if user is None or not user.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    access_token = create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "image_url": user.image_url,
            "provider": user.provider,
        },
    }

@app.get("/api/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user information."""
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.name,
        "image_url": current_user.image_url,
        "provider": current_user.provider
    }

@app.get("/api/subjects")
def get_subjects(current_user: Optional[User] = Depends(get_current_user_optional)):
    """Returns a list of supported subjects (authentication optional)."""
    return {"subjects": SUPPORTED_SUBJECTS}

@app.get("/api/chats", response_model=list[ChatSessionSummary])
def list_chat_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List chat sessions for the current user, most recently updated first."""
    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .all()
    )

    return [
        ChatSessionSummary(
            id=session.id,
            title=session.title,
            subject=session.subject,
            created_at=session.created_at,
            updated_at=session.updated_at,
            message_count=len(session.messages),
        )
        for session in sessions
    ]

@app.post("/api/chats", response_model=ChatSessionSummary)
def create_chat_session(
    request: CreateChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new empty chat session."""
    session = _create_chat_session(
        db,
        current_user,
        request.subject,
        request.title,
    )
    return ChatSessionSummary(
        id=session.id,
        title=session.title,
        subject=session.subject,
        created_at=session.created_at,
        updated_at=session.updated_at,
        message_count=0,
    )

@app.get("/api/chats/{session_id}", response_model=ChatSessionDetail)
def get_chat_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a chat session with all messages."""
    session = _get_user_session(session_id, current_user, db)
    return ChatSessionDetail(
        id=session.id,
        title=session.title,
        subject=session.subject,
        created_at=session.created_at,
        updated_at=session.updated_at,
        messages=[
            ChatMessageResponse(
                id=message.id,
                role=message.role,
                content=message.content,
                response_data=message.response_data,
                created_at=message.created_at,
            )
            for message in session.messages
        ],
    )

@app.delete("/api/chats/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat_session(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a chat session and all its messages."""
    session = _get_user_session(session_id, current_user, db)
    db.delete(session)
    db.commit()


def _normalize_response(resp: Any) -> dict:
    """
    Coerce a RAG/LLM response dict into a shape that always satisfies the
    QueryResponse response model. GROQ's JsonOutputParser can return partial
    JSON (missing keys) or mistyped fields (e.g. a string where a list is
    expected); without this, FastAPI response validation fails and the API
    returns HTTP 500 ("Failed to get response from AI").
    """
    if not isinstance(resp, dict):
        resp = {}

    text_fields = ["answer", "summary"]
    list_fields = [
        "topics", "resources", "images", "video_links",
        "interview_questions", "dsa_concepts", "sources",
    ]
    for f in text_fields:
        if not isinstance(resp.get(f), str):
            resp[f] = ""
    for f in list_fields:
        if not isinstance(resp.get(f), list):
            resp[f] = []
    return resp


@app.post("/api/query", response_model=QueryResponse)
def query_ai(
    request: QueryRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Endpoint to process a user query (requires authentication).
    Persists user and assistant messages to the user's chat history.
    """
    if request.session_id is not None:
        chat_session = _get_user_session(request.session_id, current_user, db)
    else:
        chat_session = _create_chat_session(db, current_user, request.subject)

    user_message = ChatMessage(
        session_id=chat_session.id,
        role="user",
        content=request.query,
    )
    db.add(user_message)

    try:
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("GROQ_API_KEY not found. Using mock response.")
            response = get_mock_response(request.query, request.subject)
        else:
            response = get_response(request.query, request.subject)
    except Exception as e:
        print(f"Error processing query: {e}. Falling back to mock response.")
        response = get_mock_response(request.query, request.subject)

    response = _normalize_response(response)

    assistant_message = ChatMessage(
        session_id=chat_session.id,
        role="assistant",
        content=response.get("answer", ""),
        response_data=response,
    )
    db.add(assistant_message)

    if chat_session.title == "New Chat":
        chat_session.title = _truncate_title(request.query)

    chat_session.subject = request.subject
    chat_session.updated_at = datetime.utcnow()
    db.commit()

    return {**response, "session_id": chat_session.id}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
