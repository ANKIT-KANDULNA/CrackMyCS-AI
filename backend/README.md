# CrackMyCS AI Backend

This is the backend for CrackMyCS AI, a RAG-based CS Fundamentals Assistant for interview prep.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**
   Copy `.env.example` to `.env` and configure your API keys:
   ```bash
   cp .env.example .env
   ```
   Add your `GROQ_API_KEY` to the `.env` file.

3. **Run the Server**
   ```bash
   uvicorn main:app --reload
   ```

4. **API Endpoints**
   - `GET /api/health` - Health check
   - `GET /api/subjects` - List of supported subjects
   - `POST /api/query` - Submit a query to the AI assistant
