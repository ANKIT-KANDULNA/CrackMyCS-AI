"""
ingest.py — Document Ingestion Script for RAG Pipeline

Loads documents from the knowledge base directory, splits them into chunks,
generates embeddings, and stores them in a FAISS vector store for retrieval.

Usage:
    python ingest.py
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

load_dotenv()

# Paths
KNOWLEDGE_BASE_DIR = Path(__file__).parent.parent / "data" / "knowledge_base"
VECTOR_STORE_DIR = Path(__file__).parent / "vectorstore"


def load_documents():
    """Load all text/markdown documents from the knowledge base."""
    loader = DirectoryLoader(
        str(KNOWLEDGE_BASE_DIR),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=True,
    )
    documents = loader.load()

    # Also load .txt files
    txt_loader = DirectoryLoader(
        str(KNOWLEDGE_BASE_DIR),
        glob="**/*.txt",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
        show_progress=True,
    )
    documents.extend(txt_loader.load())

    print(f"Loaded {len(documents)} documents from knowledge base.")
    return documents


def split_documents(documents):
    """Split documents into chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")
    return chunks


def create_vector_store(chunks):
    """Generate embeddings and store in FAISS vector store."""
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectorstore = FAISS.from_documents(chunks, embeddings)

    # Save locally
    VECTOR_STORE_DIR.mkdir(parents=True, exist_ok=True)
    vectorstore.save_local(str(VECTOR_STORE_DIR))
    print(f"Vector store saved to {VECTOR_STORE_DIR}")

    return vectorstore


def main():
    """Run the full ingestion pipeline."""
    print("=" * 50)
    print("CrackMyCS AI — Knowledge Base Ingestion")
    print("=" * 50)

    documents = load_documents()
    if not documents:
        print("No documents found. Add .md or .txt files to data/knowledge_base/")
        return

    chunks = split_documents(documents)
    create_vector_store(chunks)

    print("\n✅ Ingestion complete! Vector store is ready for retrieval.")


if __name__ == "__main__":
    main()
