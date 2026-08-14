from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import os

from rag_chain import get_response
from mock_responses import get_mock_response

load_dotenv()

app = FastAPI(title="CrackMyCS AI Backend")

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

SUPPORTED_SUBJECTS = [
    "OS", "DBMS", "OOPs", "CN", "System Design", "Software Engineering"
]

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}

@app.get("/api/subjects")
def get_subjects():
    """Returns a list of supported subjects."""
    return {"subjects": SUPPORTED_SUBJECTS}

@app.post("/api/query", response_model=QueryResponse)
def query_ai(request: QueryRequest):
    """
    Endpoint to process a user query.
    Tries to use the RAG chain (Groq LLM). 
    Falls back to mock responses if API key is missing or an error occurs.
    """
    try:
        # Check if API key is available
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("GROQ_API_KEY not found. Using mock response.")
            return get_mock_response(request.query, request.subject)
            
        # Attempt to get real response from LLM
        response = get_response(request.query, request.subject)
        return response
        
    except Exception as e:
        print(f"Error processing query: {e}. Falling back to mock response.")
        return get_mock_response(request.query, request.subject)

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
