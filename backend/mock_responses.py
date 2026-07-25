def get_mock_response(query: str, subject: str) -> dict:
    """
    Returns a rich, detailed mock response based on the query and subject.
    """
    query_lower = query.lower()
    
    responses = {
        "os": {
            "thread": {
                "answer": "A thread is the smallest sequence of programmed instructions that can be managed independently by a scheduler. Threads within the same process share the same data space, open files, and other resources, which makes context switching between threads much faster than process context switching.\n\nIn modern operating systems, multithreading is used to achieve parallelism and improve application responsiveness. For example, a web browser might use one thread for rendering the UI and another for downloading files in the background.",
                "topics": ["Multithreading", "Concurrency", "Process vs Thread", "Context Switching"],
                "resources": [
                    {"title": "Threads in OS - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/thread-in-operating-system/"},
                    {"title": "Multithreading - JavaTPoint", "url": "https://www.javatpoint.com/os-threads"}
                ],
                "dsa_concepts": ["Queues (for thread scheduling)", "Graphs (for deadlock detection)"]
            },
            "deadlock": {
                "answer": "A deadlock is a situation in a multiprogramming environment where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process. This results in a circular waiting condition where none of the processes can proceed.\n\nDeadlocks can be handled using four main strategies: prevention, avoidance (e.g., Banker's Algorithm), detection and recovery, and ignorance (the Ostrich algorithm, which is used by most modern OS like Windows and Linux).",
                "topics": ["Banker's Algorithm", "Mutex", "Semaphores", "Resource Allocation Graph"],
                "resources": [
                    {"title": "Deadlock in OS - GeeksforGeeks", "url": "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-system/"}
                ],
                "dsa_concepts": ["Graphs (Resource Allocation Graph)", "Arrays", "Matrices"]
            }
        },
        "dbms": {
            "acid": {
                "answer": "ACID stands for Atomicity, Consistency, Isolation, and Durability. These are a set of properties of database transactions intended to guarantee data validity despite errors, power failures, and other mishaps.\n\nAtomicity ensures that a transaction is treated as a single, indivisible logical unit of work. Consistency ensures the database moves from one valid state to another. Isolation ensures concurrent execution leaves the database in the same state that would have been obtained if transactions were executed sequentially. Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure.",
                "topics": ["Transactions", "Concurrency Control", "Database Normalization", "Isolation Levels"],
                "resources": [
                    {"title": "ACID Properties in DBMS", "url": "https://www.geeksforgeeks.org/acid-properties-in-dbms/"}
                ],
                "dsa_concepts": ["B-Trees (for indexing)", "Hash Tables", "Write-Ahead Logging (Queues)"]
            }
        }
    }
    
    subject_lower = subject.lower()
    
    default_response = {
        "answer": f"This is a detailed default response for {subject}. In an actual interview, you should be prepared to discuss the core principles of {subject} thoroughly, providing real-world examples and explaining trade-offs. Ensure you are familiar with the common design patterns, typical bottlenecks, and how data flows through the systems related to this topic.",
        "topics": [f"{subject} Basics", "Advanced Concepts", "Best Practices", "System Architecture"],
        "resources": [
            {"title": f"Complete Guide to {subject}", "url": "https://www.geeksforgeeks.org/"},
            {"title": f"{subject} Interview Questions", "url": "https://www.javatpoint.com/"}
        ],
        "dsa_concepts": ["Arrays", "Linked Lists", "Trees", "Graphs"]
    }

    if subject_lower in responses:
        for keyword, resp in responses[subject_lower].items():
            if keyword in query_lower:
                return resp
                
    return default_response
