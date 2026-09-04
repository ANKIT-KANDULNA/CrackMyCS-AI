from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    __table_args__ = (
        UniqueConstraint("provider", "provider_id", name="uq_provider_account"),
    )

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=False)  # 'google' or 'credentials'
    provider_id = Column(String, nullable=False)  # provider account id, or email for credentials
    password_hash = Column(String, nullable=True)  # populated only when provider == 'credentials'
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    chat_sessions = relationship("ChatSession", back_populates="user", cascade="all, delete-orphan")


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    subject = Column(String, nullable=False)
    title = Column(String, nullable=False, default="New Chat")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="chat_sessions")
    messages = relationship(
        "ChatMessage",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="ChatMessage.created_at",
    )


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, ForeignKey("chat_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(String, nullable=False)  # 'user' or 'assistant'
    content = Column(Text, nullable=False)
    response_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")