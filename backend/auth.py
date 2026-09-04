from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
import os
import bcrypt

def get_jwt_secret_key():
    """Get JWT secret key from environment, fail if not set in production."""
    secret_key = os.getenv("JWT_SECRET_KEY")
    if not secret_key:
        # DEVELOPMENT ONLY: Allow default for local testing
        # WARNING: Never use this default in production!
        return "dev-secret-key-change-in-production-insecure"
    return secret_key

SECRET_KEY = get_jwt_secret_key()
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# bcrypt truncates passwords > 72 bytes. We pre-hash with sha256 to safely
# support arbitrary-length passwords without hitting bcrypt's limit.
def hash_password(password: str) -> str:
    """Hash a password using bcrypt (sha256-prehashed for length safety)."""
    import hashlib
    pre = hashlib.sha256(password.encode("utf-8")).hexdigest()
    return bcrypt.hashpw(pre.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against a stored bcrypt hash."""
    import hashlib
    pre = hashlib.sha256(password.encode("utf-8")).hexdigest()
    try:
        return bcrypt.checkpw(pre.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    user_id: str = Depends(verify_token),
    db: Session = Depends(get_db)
) -> User:
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user

async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer(auto_error=False)),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if credentials is None:
        return None
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        user = db.query(User).filter(User.id == int(user_id)).first()
        return user
    except (JWTError, ValueError):
        return None