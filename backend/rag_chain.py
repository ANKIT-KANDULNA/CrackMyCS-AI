import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import json
from pathlib import Path
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from ddgs import DDGS
load_dotenv()

class ResponseSchema(BaseModel):
    answer: str = Field(description="Detailed answer to the user's query, in 2-3 paragraphs.")
    topics: list[str] = Field(description="4-5 relevant topics related to the query.")
    resources: list[dict] = Field(description="List of 3-4 resources with 'title' and 'url' keys.")
    dsa_concepts: list[str] = Field(description="3-4 related Data Structures and Algorithms concepts.")
    sources: list[str] = Field(description="List of knowledge base source filenames that contained relevant information used to answer the query. If the context was irrelevant, leave this empty.")

system_prompt = """You are an expert Computer Science professor and interview prep coach specializing in CS fundamentals like Operating Systems (OS), Database Management Systems (DBMS), Object-Oriented Programming (OOPs), Computer Networks (CN), System Design, and Software Engineering.

Your goal is to provide clear, detailed, and accurate explanations for interview preparation. 

Subject area for this query: {subject}

Knowledge Base Context:
{context}

Instructions:
1. Provide a concise, highly-focused answer tailored strictly for a technical software engineering interview. Avoid fluff. Focus on what an interviewer wants to hear: core principles, real-world trade-offs, and edge cases. Keep it to 2-3 punchy paragraphs.
2. List 4-5 relevant technical topics that the student should study next based on this question.
3. Recommend 3-4 high-quality, real web resources directly related to the user's specific question. You MUST use the actual URLs provided in the Web Search Results section below (if any are relevant). Do not make up URLs.
4. List 3-4 relevant Data Structures and Algorithms (DSA) concepts that relate to this topic or are commonly used in its implementation.
5. In the `sources` field, list ONLY the exact source filenames (e.g. 'os.txt', 'dbms.md') from the Knowledge Base Context that were actually helpful in answering the query. If the provided context was irrelevant to the user's question, leave the `sources` array empty.
6. IMPORTANT: Your entire response MUST be a single, valid JSON object. Do NOT include any markdown formatting (like ```json), and do NOT include any conversational text before or after the JSON.

{format_instructions}
"""

def get_response(query: str, subject: str) -> dict:
    """
    Generates a response using the LangChain RAG pipeline and ChatGroq.
    Returns a dictionary with keys: answer, topics, resources, dsa_concepts.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set.")

    llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key, temperature=0.2)
    parser = JsonOutputParser(pydantic_object=ResponseSchema)
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{query}")
    ])
    
    # Load Vector Store
    vectorstore_path = Path(__file__).parent / "vectorstore"
    context = ""
    if vectorstore_path.exists():
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        vectorstore = FAISS.load_local(str(vectorstore_path), embeddings, allow_dangerous_deserialization=True)
        docs = vectorstore.similarity_search(query, k=4)
        context = "\n\n".join([f"Source: {os.path.basename(d.metadata.get('source', 'Unknown'))}\n{d.page_content}" for d in docs])
    else:
        print("Warning: Vector store not found. Proceeding without context.")

    # Add real-time web search results via DDGS for multiple sources
    search_context = ""
    try:
        ddgs = DDGS()
        results = list(ddgs.text(f"{subject} {query}", max_results=4))
        if results:
            search_context = "\n--- Web Search Results ---\n"
            for r in results:
                search_context += f"Title: {r['title']}\nURL: {r['href']}\nSnippet: {r['body']}\n\n"
    except Exception as e:
        print(f"Web search failed: {e}")

    context = context + "\n\n" + search_context

    chain = prompt | llm | parser
    
    try:
        response = chain.invoke({
            "query": query,
            "subject": subject,
            "context": context,
            "format_instructions": parser.get_format_instructions()
        })
        return response
    except Exception as e:
        print(f"Error in RAG chain: {e}")
        raise e
