"""
ingest.py — Document Ingestion Script for RAG Pipeline

Loads documents from the knowledge base directory, splits them into chunks,
generates embeddings, and stores them in a Pinecone cloud vector store for retrieval.

Usage:
    python ingest.py
"""

import os
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

# Paths
KNOWLEDGE_BASE_DIR = Path(__file__).parent.parent / "data" / "knowledge_base"

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "cs-knowledge-base"


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

    # Filter out README files — they contain repo instructions, not CS content
    documents = [
        doc for doc in documents
        if not os.path.basename(doc.metadata.get("source", "")).upper().startswith("README")
    ]

    print(f"Loaded {len(documents)} documents from knowledge base.")
    return documents


def split_documents(documents):
    """Split documents into chunks for embedding."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,  # Increased to reduce total number of chunks
        chunk_overlap=150,  # Reduced overlap
        length_function=len,
        separators=["\n\n", "\n", ". ", " ", ""],
    )
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.")
    return chunks


def create_vector_store(chunks):
    """Generate embeddings and store in Pinecone cloud vector store."""
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY is not set in environment variables.")
    
    # Initialize Pinecone
    pc = Pinecone(api_key=PINECONE_API_KEY)
    
    # Check if index exists, if not create it
    existing_indexes = [index.name for index in pc.list_indexes()]
    if PINECONE_INDEX_NAME not in existing_indexes:
        print(f"Creating Pinecone index: {PINECONE_INDEX_NAME}")
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=384,  # all-MiniLM-L6-v2 dimension
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        print(f"Index {PINECONE_INDEX_NAME} created successfully.")
    else:
        print(f"Using existing Pinecone index: {PINECONE_INDEX_NAME}")
    
    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    
    # Upload documents to Pinecone
    print(f"Uploading {len(chunks)} chunks to Pinecone...")
    vectorstore = PineconeVectorStore.from_documents(
        documents=chunks,
        embedding=embeddings,
        index_name=PINECONE_INDEX_NAME,
        pinecone_api_key=PINECONE_API_KEY
    )
    
    print(f"✅ Successfully uploaded {len(chunks)} chunks to Pinecone index '{PINECONE_INDEX_NAME}'")
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
