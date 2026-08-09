def get_mock_response(query: str, subject: str) -> dict:
    """
    Returns a rich, detailed mock response based on the query and subject.
    """
    query_lower = query.lower()
    
    responses = {
        "os": {
            "thread": {
                "answer": "Overview:\nA thread is the smallest sequence of programmed instructions that can be managed independently by a scheduler.\n\nKey Concepts:\n- Threads within the same process share memory, file handles, and other resources.\n- Context switching between threads is much faster than process switching because threads share the same address space.\n\nPractical Impact:\nMultithreading improves responsiveness and parallelism in real-world systems. For example, a browser can render UI on one thread while downloading files on another.",
                "summary": "• Threads are independent units of execution within a process\n• Threads share memory and resources, enabling faster context switching\n• Multithreading improves application responsiveness and parallelism\n• Used in web browsers, servers, and multimedia applications",
                "topics": ["Multithreading", "Concurrency", "Process vs Thread", "Context Switching"],
                "resources": [
                    {"title": "Threads in OS - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/thread-in-operating-system/"},
                    {"title": "Multithreading - JavaTPoint", "url": "https://www.javatpoint.com/os-threads"}
                ],
                "images": [
                    {
                        "title": "Thread vs Process Diagram",
                        "image_url": "https://www.geeksforgeeks.org/wp-content/uploads/Process-Thread.png",
                        "source_url": "https://www.geeksforgeeks.org/thread-in-operating-system/"
                    }
                ],
                "video_links": [
                    {
                        "title": "Threads in Operating System - Full Explanation",
                        "url": "https://www.youtube.com/watch?v=example1",
                        "thumbnail": "https://img.youtube.com/vi/example1/default.jpg"
                    }
                ],
                "interview_questions": [
                    "What is the difference between a process and a thread?",
                    "How does thread context switching differ from process context switching?",
                    "What are the advantages and disadvantages of multithreading?",
                    "Explain the concept of thread synchronization and why it's needed."
                ],
                "dsa_concepts": ["Queues (for thread scheduling)", "Graphs (for deadlock detection)"],
                "sources": ["os_multithreading.md"]
            },
            "deadlock": {
                "answer": "A deadlock is a situation in a multiprogramming environment where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process. This results in a circular waiting condition where none of the processes can proceed.\n\nDeadlocks can be handled using four main strategies: prevention, avoidance (e.g., Banker's Algorithm), detection and recovery, and ignorance (the Ostrich algorithm, which is used by most modern OS like Windows and Linux).",
                "summary": "• Deadlock occurs when processes wait circularly for resources held by each other\n• Four necessary conditions: mutual exclusion, hold and wait, no preemption, circular wait\n• Handling strategies: prevention, avoidance, detection/recovery, ignorance\n• Banker's Algorithm is a key avoidance technique",
                "topics": ["Banker's Algorithm", "Mutex", "Semaphores", "Resource Allocation Graph"],
                "resources": [
                    {"title": "Deadlock in OS - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/"}
                ],
                "images": [
                    {
                        "title": "Deadlock Resource Allocation Graph",
                        "image_url": "https://www.geeksforgeeks.org/wp-content/uploads/deadlock-rag.png",
                        "source_url": "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/"
                    }
                ],
                "video_links": [
                    {
                        "title": "Deadlock in Operating System with Examples",
                        "url": "https://www.youtube.com/watch?v=example2",
                        "thumbnail": "https://img.youtube.com/vi/example2/default.jpg"
                    }
                ],
                "interview_questions": [
                    "What are the four necessary conditions for a deadlock to occur?",
                    "Explain the Banker's Algorithm for deadlock avoidance.",
                    "How does deadlock detection and recovery work?",
                    "Why do most modern operating systems use the Ostrich algorithm for deadlocks?"
                ],
                "dsa_concepts": ["Graphs (Resource Allocation Graph)", "Arrays", "Matrices"],
                "sources": ["os_deadlocks.md", "concurrency.md"]
            }
        },
        "dbms": {
            "acid": {
                "answer": "ACID stands for Atomicity, Consistency, Isolation, and Durability. These are a set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps.\n\nAtomicity ensures that a transaction is treated as a single, indivisible logical unit of work. Consistency ensures the database moves from one valid state to another. Isolation ensures concurrent execution leaves the database in the same state that would have been obtained if transactions were executed sequentially. Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure.",
                "summary": "• ACID ensures database transactions are reliable and consistent\n• Atomicity: transactions are all-or-nothing operations\n• Consistency: database moves between valid states\n• Isolation: concurrent transactions don't interfere with each other\n• Durability: committed transactions persist despite failures",
                "topics": ["Transactions", "Concurrency Control", "Database Normalization", "Isolation Levels"],
                "resources": [
                    {"title": "ACID Properties in DBMS", "url": "https://www.geeksforgeeks.org/acid-properties-in-dbms/"}
                ],
                "images": [
                    {
                        "title": "ACID Properties Diagram",
                        "image_url": "https://www.geeksforgeeks.org/wp-content/uploads/acid-properties.png",
                        "source_url": "https://www.geeksforgeeks.org/acid-properties-in-dbms/"
                    }
                ],
                "video_links": [
                    {
                        "title": "ACID Properties in Database Management Systems",
                        "url": "https://www.youtube.com/watch?v=example3",
                        "thumbnail": "https://img.youtube.com/vi/example3/default.jpg"
                    }
                ],
                "interview_questions": [
                    "Explain each of the ACID properties with real-world examples.",
                    "What happens if a database doesn't support ACID properties?",
                    "How do isolation levels affect transaction behavior?",
                    "What is the difference between consistency and durability?"
                ],
                "dsa_concepts": ["B-Trees (for indexing)", "Hash Tables", "Write-Ahead Logging (Queues)"],
                "sources": ["dbms_transactions.md"]
            }
        }
    }
    
    subject_lower = subject.lower()
    
    default_response = {
        "answer": f"This is a detailed default response for {subject}. In an actual interview, you should be prepared to discuss the core principles of {subject} thoroughly, providing real-world examples and explaining trade-offs. Ensure you are familiar with the common design patterns, typical bottlenecks, and how data flows through the systems related to this topic.",
        "summary": f"• Understanding {subject} fundamentals is crucial for technical interviews\n• Focus on core principles, trade-offs, and real-world applications\n• Practice explaining concepts clearly and concisely\n• Be prepared to discuss system design and architecture decisions",
        "topics": [f"{subject} Basics", "Advanced Concepts", "Best Practices", "System Architecture"],
        "resources": [
            {"title": f"Complete Guide to {subject}", "url": "https://www.geeksforgeeks.org/"},
            {"title": f"{subject} Interview Questions", "url": "https://www.javatpoint.com/"}
        ],
        "images": [],
        "video_links": [],
        "interview_questions": [
            f"What are the fundamental concepts of {subject}?",
            f"Explain a common problem in {subject} and how you would solve it.",
            f"What are the trade-offs between different approaches in {subject}?",
            f"How would you design a system related to {subject}?"
        ],
        "dsa_concepts": ["Arrays", "Linked Lists", "Trees", "Graphs"],
        "sources": ["mock_knowledge_base.md"]
    }

    if subject_lower in responses:
        for keyword, resp in responses[subject_lower].items():
            if keyword in query_lower:
                return resp
                
    return default_response

