import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
import json

load_dotenv()

class ResponseSchema(BaseModel):
    answer: str = Field(description="Detailed answer to the user's query, in 2-3 paragraphs.")
    topics: list[str] = Field(description="4-5 relevant topics related to the query.")
    resources: list[dict] = Field(description="List of 3-4 resources with 'title' and 'url' keys.")
    dsa_concepts: list[str] = Field(description="3-4 related Data Structures and Algorithms concepts.")

system_prompt = """You are an expert Computer Science professor and interview prep coach specializing in CS fundamentals like Operating Systems (OS), Database Management Systems (DBMS), Object-Oriented Programming (OOPs), Computer Networks (CN), System Design, and Software Engineering.

Your goal is to provide clear, detailed, and accurate explanations for interview preparation. 

Subject area for this query: {subject}

Instructions:
1. Provide a detailed answer in 2-3 paragraphs.
2. List 4-5 relevant topics that the student should also study.
3. Recommend 3-4 high-quality resources (like GeeksforGeeks, JavaTPoint, YouTube, etc.) with a relevant title and a plausible URL.
4. List 3-4 relevant Data Structures and Algorithms (DSA) concepts that relate to this topic or are commonly used in its implementation.

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
    
    chain = prompt | llm | parser
    
    try:
        response = chain.invoke({
            "query": query,
            "subject": subject,
            "format_instructions": parser.get_format_instructions()
        })
        return response
    except Exception as e:
        print(f"Error in RAG chain: {e}")
        raise e
