# CrackMyCS AI — RAG-based CS Fundamentals Assistant

> AI-powered Retrieval-Augmented Generation system to help students prepare for technical interviews by answering queries on core CS subjects.

![LangChain](https://img.shields.io/badge/LangChain-Framework-blue)
![Groq](https://img.shields.io/badge/Groq-LLM_API-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-teal)
![RAG](https://img.shields.io/badge/RAG-Pipeline-purple)
![Pinecone](https://img.shields.io/badge/Pinecone-Vector_Store-orange)

## 🎯 Features

- **6 Core CS Subjects** — OS, DBMS, OOPs, Computer Networks, System Design, Software Engineering
- **RAG Pipeline** — Retrieval-Augmented Generation using LangChain + Groq (Llama 3.3 70B)
- **Curated Knowledge Base** — Grounded in CampusX CS fundamentals content for accurate, structured responses
- **Vector Store** — Pinecone-powered semantic search over embedded knowledge base documents
- **Smart Responses** — Returns relevant interview topics, learning resources, and associated DSA concepts
- **Modern UI** — Glassmorphism design with dark theme, animations, and responsive layout

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, Tailwind CSS, TypeScript |
| **Backend** | Python, FastAPI, Uvicorn |
| **LLM** | Groq API (OpenAI GPT-OSS 20B) |
| **Orchestration** | LangChain |
| **Embeddings** | HuggingFace (all-MiniLM-L6-v2) |
| **Vector Store** | Pinecone (cloud vector DB) |
| **Architecture** | RAG (Retrieval-Augmented Generation) |
| **Deployment** | Vercel (Frontend) · Render (Backend) |

## 📁 Project Structure

```
crack-my-cs-ai/
│
├── frontend/                   # Next.js Frontend UI (Deploy to Vercel)
│   ├── src/                    # Source code (app, components, lib)
│   ├── package.json            # Node dependencies
│   ├── next.config.ts          # Next.js config
│   └── vercel.json             # Vercel deployment config
│
├── backend/                    # Backend API (Deploy to Render/Railway)
│   ├── main.py                 # FastAPI server with /api/query endpoint
│   ├── rag_chain.py            # LangChain + Groq RAG pipeline
│   ├── mock_responses.py       # Fallback mock responses
│   ├── ingest.py               # Document ingestion → Pinecone vector store
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment variable template
│   └── README.md               # Backend setup instructions
│
├── data/
│   └── knowledge_base/         # Curated CS content for RAG retrieval
│       └── README.md           # Instructions for adding documents
│
├── README.md                   # This file
└── .gitignore
```

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Ingest knowledge base (optional — needs docs in data/knowledge_base/)
python ingest.py

# Start the API server
uvicorn main:app --reload
```

## 🔧 How It Works

```
User Query
    │
    ▼
┌──────────────┐     ┌─────────────────────┐
│   Frontend   │────▶│   FastAPI Backend    │
│   (Chat UI)  │     │   POST /api/query    │
└──────────────┘     └──────────┬────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   LangChain Pipeline  │
                    │                       │
                    │  1. Embed user query  │
                    │  2. Pinecone retrieval│
                    │  3. Build prompt with │
                    │     retrieved context │
                    │  4. Groq LLM (Llama)  │
                    │     generates answer  │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼───────────┐
                    │   Structured Response │
                    │  • Answer             │
                    │  • Interview Topics   │
                    │  • Learning Resources │
                    │  • DSA Concepts       │
                    └───────────────────────┘
```

## 📝 Supported Subjects

| Subject | Topics Covered |
|---------|---------------|
| ⚙️ **Operating Systems** | Process management, memory, deadlocks, scheduling |
| 🗄️ **DBMS** | SQL, normalization, ACID, transactions, indexing |
| 🧬 **OOPs** | 4 pillars, SOLID principles, design patterns |
| 🌐 **Computer Networks** | TCP/IP, OSI model, protocols, DNS |
| 🏗️ **System Design** | Scalability, caching, load balancing, distributed systems |
| 📐 **Software Engineering** | SDLC, Agile, testing, CI/CD |

## 🌐 Deployment

### Frontend → Vercel
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set **Root Directory** to `frontend`
4. Deploy — done!

### Backend → Render
1. Create a new Web Service on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add `GROQ_API_KEY` environment variable
6. **Set `DATABASE_URL`** to a persistent PostgreSQL connection string (e.g. from Render Postgres). If omitted, the backend falls back to SQLite on ephemeral disk — **all users and chat history will be lost on every deploy/restart**.

## ❓ Troubleshooting

### OAuth sign-in fails with a generic "Callback" error

The most common cause is an `AUTH_CALLBACK_SECRET` mismatch between the frontend and backend.

- Both `frontend/.env.local` and `backend/.env` must define `AUTH_CALLBACK_SECRET` with the **exact same value**.
- If the value is missing or different on either side, the backend returns `403 Invalid auth callback secret`, which surfaces as a vague error on the sign-in page.
- Generate a shared secret once (`openssl rand -base64 32`) and paste it into both `.env` files.
- Check the Next.js server logs for the message: *"Auth callback secret mismatch"* — this confirms the issue.

## 📄 License

MIT License
