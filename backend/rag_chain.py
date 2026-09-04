import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from pathlib import Path
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec
from urllib.parse import urlparse

try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS

load_dotenv()

# Pinecone configuration
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
PINECONE_INDEX_NAME = "cs-knowledge-base"

# Domains that rarely yield useful CS interview articles
_BLOCKED_DOMAINS = {
    "store.steampowered.com",
    "steampowered.com",
    "amazon.com",
    "www.amazon.com",
    "ebay.com",
    "www.ebay.com",
    "pinterest.com",
    "www.pinterest.com",
    "facebook.com",
    "www.facebook.com",
    "instagram.com",
    "www.instagram.com",
    "twitter.com",
    "x.com",
    "reddit.com",
    "www.reddit.com",
}


class ResponseSchema(BaseModel):
    answer: str = Field(description="Detailed answer to the user's query, structured with clear subheadings and concise theory.")
    summary: str = Field(description="Concise bullet-point summary of the key points (3-5 bullets).")
    topics: list[str] = Field(description="4-5 relevant topics related to the query.")
    resources: list[dict] = Field(
        default_factory=list,
        description="Leave empty. Web resources are attached separately from live search.",
    )
    images: list[dict] = Field(
        default_factory=list,
        description="Leave empty. Image links are added automatically from live search.",
    )
    video_links: list[dict] = Field(
        default_factory=list,
        description="Leave empty. Video links are added automatically from live search.",
    )
    interview_questions: list[str] = Field(description="3-5 practice interview questions related to the topic.")
    dsa_concepts: list[str] = Field(description="3-4 related Data Structures and Algorithms concepts.")
    sources: list[str] = Field(
        description="List of knowledge base source filenames that contained relevant information used to answer the query. If the context was irrelevant, leave this empty."
    )


system_prompt = """You are an expert Computer Science professor and interview prep coach specializing in CS fundamentals like Operating Systems (OS), Database Management Systems (DBMS), Object-Oriented Programming (OOPs), Computer Networks (CN), System Design, and Software Engineering.

Your goal is to provide clear, detailed, and accurate explanations for interview preparation. 

Subject area for this query: {subject}

Knowledge Base Context:
{context}

Instructions:
1. Provide a concise, highly-focused answer tailored strictly for a technical software engineering interview. Avoid fluff. Focus on what an interviewer wants to hear: core principles, real-world trade-offs, and edge cases.
2. Structure the answer with explicit, machine-friendly section headings. Use headings such as "Overview:", "Key Concepts:", "Theory:", "Practical Impact:", "Code Example:", and "Summary:". Put each heading on its own line, followed by one or more sentences or bullet points.
3. Do NOT return a long unstructured paragraph. If the concept supports it, provide at least two distinct sections with headings.
4. Create a bullet-point summary with 3-5 key takeaways that capture the essence of the topic.
5. List 4-5 relevant technical topics that the student should study next based on this question.
6. Set `resources` to an empty array []. Do not invent or recommend URLs — web links are added automatically from live search.
5. Set `images` to an empty array []. Do not invent image URLs — image links are added automatically from live search.
6. Set `video_links` to an empty array []. Do not invent video URLs — video links are added automatically from live search.
7. Generate 3-5 practice interview questions that test understanding of this topic, ranging from basic to advanced.
8. List 3-4 relevant Data Structures and Algorithms (DSA) concepts that relate to this topic or are commonly used in its implementation.
9. In the `sources` field, list ONLY the exact source filenames (e.g. 'os.txt', 'dbms.md') from the Knowledge Base Context that were actually helpful in answering the query. If the provided context was irrelevant to the user's question, leave the `sources` array empty.
10. IMPORTANT: Your entire response MUST be a single, valid JSON object. Do NOT include any markdown formatting (like ```json), and do NOT include any conversational text before or after the JSON.

{format_instructions}
"""


def _is_usable_article_url(url: str) -> bool:
    if not url or not url.startswith(("http://", "https://")):
        return False
    try:
        host = urlparse(url).netloc.lower().removeprefix("www.")
    except Exception:
        return False
    if not host:
        return False
    # Block known low-signal domains (with and without www.)
    if host in _BLOCKED_DOMAINS or f"www.{host}" in _BLOCKED_DOMAINS:
        return False
    return True


def search_web_resources(query: str, subject: str, max_results: int = 3) -> list[dict]:
    """
    Fetch top article-style web results for the query via DuckDuckGo.
    Returns a list of {title, url} dicts (up to max_results).
    """
    search_query = f"{subject} {query} explained OR tutorial OR guide"
    resources: list[dict] = []
    seen: set[str] = set()

    try:
        # Fetch extras so we can filter blocked / duplicate URLs
        raw = list(DDGS().text(search_query, max_results=max_results + 6))
    except Exception as e:
        print(f"Web search failed: {e}")
        return []

    for item in raw:
        title = (item.get("title") or "").strip()
        url = (item.get("href") or item.get("url") or "").strip()
        if not title or not _is_usable_article_url(url):
            continue
        # Normalize for dedupe (strip trailing slash / fragments)
        key = url.split("#", 1)[0].rstrip("/").lower()
        if key in seen:
            continue
        seen.add(key)
        resources.append({"title": title, "url": url})
        if len(resources) >= max_results:
            break

    return resources


def search_images(query: str, subject: str, max_results: int = 3) -> list[dict]:
    """
    Fetch top image results for the query via DuckDuckGo.
    Returns a list of {title, url, image_url} dicts (up to max_results).
    """
    search_query = f"{subject} {query} diagram OR architecture OR illustration"
    images: list[dict] = []
    seen: set[str] = set()

    try:
        raw = list(DDGS().images(search_query, max_results=max_results + 5))
    except Exception as e:
        print(f"Image search failed: {e}")
        return []

    for item in raw:
        title = (item.get("title") or "").strip()
        image_url = (item.get("image") or item.get("thumbnail") or "").strip()
        source_url = (item.get("url") or "").strip()
        
        if not title or not image_url:
            continue
        
        # Normalize for dedupe
        key = image_url.split("?")[0].lower()
        if key in seen:
            continue
        seen.add(key)
        
        images.append({
            "title": title,
            "image_url": image_url,
            "source_url": source_url if source_url else None
        })
        if len(images) >= max_results:
            break

    return images


def get_vector_store():
    """
    Initialize or retrieve the Pinecone vector store.
    Returns the vector store instance for retrieval.
    """
    if not PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY is not set in environment variables.")
    
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
    
    # Initialize embeddings
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'},
        encode_kwargs={'normalize_embeddings': True}
    )
    
    # Connect to existing index
    vectorstore = PineconeVectorStore(
        index_name=PINECONE_INDEX_NAME,
        embedding=embeddings,
        pinecone_api_key=PINECONE_API_KEY
    )
    
    return vectorstore


def search_videos(query: str, subject: str, max_results: int = 2) -> list[dict]:
    """
    Fetch top video results for the query via DuckDuckGo.
    Returns a list of {title, url, thumbnail} dicts (up to max_results).
    """
    search_query = f"{subject} {query} tutorial OR explanation"
    videos: list[dict] = []
    seen: set[str] = set()

    try:
        raw = list(DDGS().videos(search_query, max_results=max_results + 5))
    except Exception as e:
        print(f"Video search failed: {e}")
        return []

    for item in raw:
        title = (item.get("title") or "").strip()
        url = (item.get("url") or item.get("content") or "").strip()
        thumbnail = (item.get("images") or item.get("thumbnail") or "").strip()
        
        if not title or not url:
            continue
        
        # Normalize for dedupe
        key = url.split("?")[0].lower()
        if key in seen:
            continue
        seen.add(key)
        
        videos.append({
            "title": title,
            "url": url,
            "thumbnail": thumbnail if thumbnail else None
        })
        if len(videos) >= max_results:
            break

    return videos


def get_response(query: str, subject: str) -> dict:
    """
    Generates a response using the LangChain RAG pipeline and ChatGroq.
    Returns a dictionary with keys: answer, topics, resources, dsa_concepts, sources.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set.")

    # Groq model for chat. Override via GROQ_MODEL env var if needed.
    # NOTE: the older "llama-3.3-70b-versatile" was removed from Groq (404 model_not_found),
    # which silently fell back to mock responses. "openai/gpt-oss-20b" is fast, reliable
    # and returns valid JSON for the response schema.
    GROQ_MODEL = os.getenv("GROQ_MODEL", "openai/gpt-oss-20b")

    llm = ChatGroq(model=GROQ_MODEL, api_key=api_key, temperature=0.2)
    parser = JsonOutputParser(pydantic_object=ResponseSchema)

    prompt = ChatPromptTemplate.from_messages([
        ("system", system_prompt),
        ("human", "{query}")
    ])

    # Use Pinecone cloud vector store for retrieval
    context = ""
    try:
        vectorstore = get_vector_store()
        retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
        relevant_docs = retriever.invoke(query)
        
        if relevant_docs:
            kb_context = "\n--- Knowledge Base Context ---\n"
            for doc in relevant_docs:
                kb_context += f"{doc.page_content}\n\n"
            context = kb_context
            print(f"Retrieved {len(relevant_docs)} relevant documents from Pinecone.")
    except Exception as e:
        print(f"Vector store retrieval failed: {e}. Falling back to web search only.")
        context = ""

    # Live web search — used both as optional context and as the sole resource list
    web_resources = search_web_resources(query, subject, max_results=3)
    if web_resources:
        search_context = "\n--- Web Search Results (for grounding only; do not invent URLs) ---\n"
        for r in web_resources:
            search_context += f"Title: {r['title']}\nURL: {r['url']}\n\n"
        context = f"{context}\n\n{search_context}".strip()

    # Search for images and videos
    images = search_images(query, subject, max_results=3)
    videos = search_videos(query, subject, max_results=2)

    chain = prompt | llm | parser

    try:
        response = chain.invoke({
            "query": query,
            "subject": subject,
            "context": context,
            "format_instructions": parser.get_format_instructions()
        })
        # Always prefer real search hits — never trust LLM-invented URLs
        if isinstance(response, dict):
            response["resources"] = web_resources
            response["images"] = images
            response["video_links"] = videos
        return response
    except Exception as e:
        print(f"Error in RAG chain: {e}")
        raise e
