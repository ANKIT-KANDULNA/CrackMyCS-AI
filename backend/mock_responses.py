def get_mock_response(query: str, subject: str) -> dict:
    """
    Returns a rich, detailed mock response based on the query and subject.
    """
    query_lower = query.lower()
    
    responses = {
        "os": {
            "thread": {
                "answer": "Overview: A thread is the smallest schedulable unit of execution inside a process. Threads within the same process share the same data space, open files, and other resources, which makes context switching between threads much cheaper than process context switching.\n\nTheory: Because threads share an address space, the OS only needs to swap the CPU register state and stack pointer instead of a full process memory map. This enables lightweight concurrency and higher responsiveness.\n\nPractical impact: Multithreading is ideal for applications that need parallelism and interaction, such as browsers or servers that separate UI/network workflows from compute-heavy background tasks.",
                "topics": ["Multithreading", "Concurrency", "Process vs Thread", "Context Switching"],
                "resources": [
                    {"title": "Threads in OS - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/thread-in-operating-system/"},
                    {"title": "Multithreading - JavaTPoint", "url": "https://www.javatpoint.com/os-threads"}
                ],
                "dsa_concepts": ["Queues (for thread scheduling)", "Graphs (for deadlock detection)"],
                "sources": ["os_multithreading.md"]
            },
            "deadlock": {
                "answer": "Overview: A deadlock occurs when a set of processes are each waiting for a resource held by another process, forming a circular wait that prevents any from making progress.\n\nTheory: Deadlock arises only when mutual exclusion, hold-and-wait, no preemption, and circular wait all hold simultaneously. Breaking any one of these conditions avoids the deadlock.\n\nResolution: Use prevention (break a Coffman condition), avoidance (Banker's Algorithm and safe-state checks), detection and recovery, or ignore it in systems that opt for the Ostrich algorithm when deadlocks are rare.",
                "topics": ["Banker's Algorithm", "Mutex", "Semaphores", "Resource Allocation Graph"],
                "resources": [
                    {"title": "Deadlock in OS - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/"}
                ],
                "dsa_concepts": ["Graphs (Resource Allocation Graph)", "Arrays", "Matrices"],
                "sources": ["os_deadlocks.md", "concurrency.md"]
            }
        },
        "dbms": {
            "acid": {
                "answer": "ACID stands for Atomicity, Consistency, Isolation, and Durability. These are a set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps.\n\nAtomicity ensures that a transaction is treated as a single, indivisible logical unit of work. Consistency ensures the database moves from one valid state to another. Isolation ensures concurrent execution leaves the database in the same state that would have been obtained if transactions were executed sequentially. Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure.",
                "topics": ["Transactions", "Concurrency Control", "Database Normalization", "Isolation Levels"],
                "resources": [
                    {"title": "ACID Properties in DBMS", "url": "https://www.geeksforgeeks.org/acid-properties-in-dbms/"}
                ],
                "dsa_concepts": ["B-Trees (for indexing)", "Hash Tables", "Write-Ahead Logging (Queues)"],
                "sources": ["dbms_transactions.md"]
            }
        }
    }
    
    subject_lower = subject.lower()
    
    default_response = {
        "answer": f"Overview: This is a detailed default response for {subject}. In an interview, focus on the core principles and real-world importance of the topic.\n\nTheory: Explain why the subject matters in software systems and how its fundamental mechanisms work.\n\nPractical advice: Mention trade-offs, common implementation choices, and the scenarios where the topic impacts system behavior most strongly.",
        "topics": [f"{subject} Basics", "Advanced Concepts", "Best Practices", "System Architecture"],
        "resources": [
            {"title": f"Complete Guide to {subject}", "url": "https://www.geeksforgeeks.org/"},
            {"title": f"{subject} Interview Questions", "url": "https://www.javatpoint.com/"}
        ],
        "dsa_concepts": ["Arrays", "Linked Lists", "Trees", "Graphs"],
        "sources": ["mock_knowledge_base.md"]
    }

    if subject_lower in responses:
        for keyword, resp in responses[subject_lower].items():
            if keyword in query_lower:
                return resp
                
    return default_response

