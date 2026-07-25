# CrackMyCS AI — RAG-based CS Fundamentals Assistant

> AI-powered Retrieval-Augmented Generation system to help students prepare for technical interviews by answering queries on core CS subjects.

![LangChain](https://img.shields.io/badge/LangChain-Framework-blue)
![Groq](https://img.shields.io/badge/Groq-LLM_API-green)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-teal)
![RAG](https://img.shields.io/badge/RAG-Pipeline-purple)

## 🎯 Features

- **6 Core CS Subjects** — OS, DBMS, OOPs, Computer Networks, System Design, Software Engineering
- **RAG Pipeline** — Retrieval-Augmented Generation using LangChain + Groq (Llama 3.3 70B)
- **Curated Knowledge Base** — Grounded in CampusX CS fundamentals content for accurate, structured responses
- **Smart Responses** — Returns relevant interview topics, learning resources, and associated DSA concepts
- **Modern UI** — Glassmorphism design with dark theme, animations, and responsive layout

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JS |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/ML** | LangChain, Groq API (Llama 3.3 70B) |
| **Architecture** | RAG (Retrieval-Augmented Generation) |
| **Deployment** | Vercel (Frontend), Render/Railway (Backend) |

## 🚀 Quick Start

### Frontend (Static Site)
```bash
# Just open index.html or deploy to Vercel
# No build step needed — it's pure HTML/CSS/JS
```

### Backend (API Server)
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env
uvicorn main:app --reload
```

## 📁 Project Structure

```
crack-my-cs-ai/
├── index.html          # Main UI
├── styles.css          # Styles (glassmorphism + dark theme)
├── app.js              # Frontend logic + mock responses
├── README.md
├── .gitignore
└── backend/
    ├── main.py             # FastAPI server
    ├── rag_chain.py        # LangChain + Groq RAG pipeline
    ├── mock_responses.py   # Fallback mock responses
    ├── requirements.txt
    ├── .env.example
    └── README.md
```

## 🔧 How It Works

1. User asks a question about any CS fundamental
2. The query is processed through LangChain's retrieval pipeline
3. Relevant context is retrieved from the curated knowledge base
4. Groq's Llama 3.3 70B generates a structured response with:
   - Detailed answer (2-3 paragraphs)
   - Related interview topics
   - Curated learning resources
   - Connected DSA concepts

## 📝 Supported Subjects

- ⚙️ **Operating Systems** — Process management, memory, deadlocks, scheduling
- 🗄️ **DBMS** — SQL, normalization, ACID, transactions, indexing
- 🧬 **OOPs** — 4 pillars, SOLID principles, design patterns
- 🌐 **Computer Networks** — TCP/IP, OSI model, protocols, DNS
- 🏗️ **System Design** — Scalability, caching, load balancing, distributed systems
- 📐 **Software Engineering** — SDLC, Agile, testing, CI/CD

## 📄 License

MIT License
