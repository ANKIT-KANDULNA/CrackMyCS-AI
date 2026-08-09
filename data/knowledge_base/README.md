# Knowledge Base — CrackMyCS AI

This folder contains the curated study material that powers the RAG (Retrieval-Augmented Generation) pipeline.

## Current Files

| File | Subject | Approx. Size |
|------|---------|-------------|
| `os.txt` | Operating Systems | ~4.8 MB |
| `dbms.txt` | Database Management Systems | ~8.5 MB |
| `oop.txt` | Object-Oriented Programming | ~3.8 MB |
| `computer-networks.txt` | Computer Networks | ~6.0 MB |
| `system-design.txt` | System Design | ~2.0 MB |
| `software-engineering.txt` | Software Engineering | ~1.5 MB |

## How to Add New Documents

1. Place `.txt` or `.md` files directly inside this folder
2. Run the ingestion script from the `backend/` directory:

```bash
cd backend
python ingest.py
```

This will:
- Load all `.txt` and `.md` files from this directory
- Split them into chunks (1000 chars, 200 overlap)
- Generate embeddings using HuggingFace `all-MiniLM-L6-v2`
- Save the FAISS vector store to `backend/vectorstore/`

## Tips for Adding Good Content

- **Plain text works best** — PDF-extracted text, markdown notes, or hand-written summaries
- **Structure clearly** — Use headings and sections so chunks have meaningful context
- **Avoid noise** — Remove page numbers, headers/footers from PDF extractions
- **Interview-focused** — Content grounded in interview questions yields better responses
- **Keep files per subject** — One subject per file makes source citation more accurate

## Re-ingesting After Changes

Any time you add, modify, or remove files in this folder, re-run `python ingest.py` to rebuild the vector store.
The old vector store in `backend/vectorstore/` will be overwritten.
