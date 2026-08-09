export interface MockResponse {
    answer: string;
    summary: string;
    topics: string[];
    resources: { title: string; url: string }[];
    images: { title: string; image_url: string; source_url?: string }[];
    video_links: { title: string; url: string; thumbnail?: string }[];
    interview_questions: string[];
    dsa_concepts: string[];
    sources?: string[];
}

export type Subject = 'os' | 'dbms' | 'oops' | 'cn' | 'system_design' | 'se';

const MOCK_RESPONSES: Record<Subject, Record<string, MockResponse>> = {
    os: {
        default: {
            answer: `Operating Systems form the backbone of computer science interviews. An OS manages hardware resources and provides services to applications through system calls. Key areas include process management (scheduling, synchronization, deadlocks), memory management (paging, segmentation, virtual memory), file systems, and I/O management.\n\nInterviewers frequently test candidates on process vs thread differences, various CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority), deadlock conditions and prevention strategies, and page replacement algorithms (FIFO, LRU, Optimal). Understanding these concepts deeply, along with their trade-offs, is crucial for cracking OS-related interview rounds.\n\nFor system design interviews, OS concepts like caching (page cache), concurrency (mutex, semaphores), and inter-process communication (pipes, shared memory, message queues) are directly applicable. Make sure to understand not just the theory but also real-world applications.`,
            summary: "• OS manages hardware resources and provides services to applications\n• Key areas: process management, memory management, file systems, I/O\n• Important for interviews: scheduling algorithms, deadlocks, page replacement\n• OS concepts directly apply to system design (caching, concurrency, IPC)",
            topics: ["Process Scheduling & Synchronization", "Memory Management & Virtual Memory", "Deadlock Detection & Prevention", "File Systems & I/O Management", "Inter-Process Communication"],
            resources: [
                { title: "Operating System Concepts - GeeksforGeeks", url: "https://www.geeksforgeeks.org/operating-systems/" },
                { title: "OS Gate Notes - Gate Smashers (YouTube)", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p" },
                { title: "Neso Academy - OS Playlist", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAdc0cPiS" }
            ],
            images: [],
            video_links: [
                { title: "OS Gate Notes - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p" },
                { title: "Neso Academy - OS Playlist", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAdc0cPiS" }
            ],
            interview_questions: [
                "What is the difference between a process and a thread?",
                "Explain the various CPU scheduling algorithms and their trade-offs.",
                "What are the four conditions required for a deadlock to occur?",
                "How does virtual memory work and why is it important?"
            ],
            dsa_concepts: ["Queue (for scheduling)", "Linked List (memory allocation)", "Graph (resource allocation)", "Semaphore & Mutex"]
        },
        scheduling: {
            answer: `Process scheduling is a fundamental OS concept that determines which process gets CPU time and when. The CPU scheduler selects from processes in the ready queue and allocates the CPU using various algorithms, each with different trade-offs between throughput, turnaround time, waiting time, and response time.

## Non-Preemptive Algorithms
**FCFS (First Come First Served)** — Simple but causes the convoy effect where short processes wait behind long ones.
**SJF (Shortest Job First)** — Optimal for average waiting time but requires knowing burst times in advance.

## Preemptive Algorithms
**SRTF (Shortest Remaining Time First)** — Preemptive version of SJF, better for varying burst times.
**Round Robin** — Uses time quantum, great for time-sharing systems and fair CPU allocation.
**Priority Scheduling** — Can cause starvation, solved with aging technique.

## Algorithm Comparison
| Algorithm | Type | Preemptive | Time Complexity | Best For | Issue |
|-----------|------|------------|-----------------|----------|-------|
| FCFS | Non-preemptive | No | O(1) | Simple systems | Convoy effect |
| SJF | Non-preemptive | No | O(n log n) | Minimum waiting time | Requires burst time knowledge |
| SRTF | Preemptive | Yes | O(n log n) | Variable burst times | Context switching overhead |
| Round Robin | Preemptive | Yes | O(1) | Time-sharing | Large time quantum = FCFS behavior |
| Priority | Both | Yes | O(1) | Priority-based tasks | Starvation |

## Interview Tips
In interviews, you'll often be asked to calculate Gantt charts, average waiting time, and turnaround time for given processes. Be ready to compare algorithms and explain when each is preferred. Multilevel Queue and Multilevel Feedback Queue are advanced schedulers used in real OS implementations like Linux CFS.`,
            summary: "• CPU scheduling determines which process gets CPU time and when\n• Non-preemptive: FCFS, SJF | Preemptive: SRTF, Round Robin, Priority\n• Key metrics: throughput, turnaround time, waiting time, response time\n• Advanced: Multilevel Queue and Multilevel Feedback Queue (Linux CFS)\n• Comparison tables help understand trade-offs between algorithms",
            topics: ["FCFS vs SJF vs Round Robin", "Preemptive vs Non-Preemptive Scheduling", "Multilevel Feedback Queue", "CPU Burst & I/O Burst Cycles", "Context Switching Overhead"],
            resources: [
                { title: "CPU Scheduling Algorithms - GeeksforGeeks", url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/" },
                { title: "Process Scheduling - Neso Academy", url: "https://www.youtube.com/watch?v=2h3eWaPx8SA" },
                { title: "CPU Scheduling Practice - JavaTPoint", url: "https://www.javatpoint.com/os-cpu-scheduling" }
            ],
            images: [],
            video_links: [
                { title: "Process Scheduling - Neso Academy", url: "https://www.youtube.com/watch?v=2h3eWaPx8SA" }
            ],
            interview_questions: [
                "Calculate the average waiting time for FCFS vs SJF scheduling.",
                "Explain the trade-offs between Round Robin and Priority scheduling.",
                "What is the convoy effect in FCFS scheduling?",
                "How does the Linux Completely Fair Scheduler (CFS) work?"
            ],
            dsa_concepts: ["Priority Queue (priority scheduling)", "Circular Queue (Round Robin)", "Queue (FCFS)", "Sorting (SJF)"]
        },
        deadlock: {
            answer: `Deadlock is a situation where two or more processes are blocked forever, each waiting for a resource held by another. It's one of the most frequently asked OS interview topics. A deadlock occurs when all four Coffman conditions are met simultaneously: **Mutual Exclusion**, **Hold and Wait**, **No Preemption**, and **Circular Wait**.

## Coffman's Four Conditions
| Condition | Description | How to Break |
|-----------|-------------|--------------|
| Mutual Exclusion | Resources cannot be shared | Use sharable resources when possible |
| Hold and Wait | Process holds resources while waiting for more | Request all resources at once |
| No Preemption | Resources cannot be forcibly taken | Allow resource preemption |
| Circular Wait | Processes wait in a circular chain | Impose resource ordering |

## Deadlock Handling Strategies
**Prevention** strategies break one of the four conditions — for example, requiring processes to request all resources at once (breaking Hold & Wait) or imposing a total ordering on resources (breaking Circular Wait). **Avoidance** uses algorithms like the Banker's Algorithm, which checks if granting a resource request leads to a safe state. **Detection** uses a wait-for graph or resource allocation graph.

## Practical Applications
In coding interviews, deadlock concepts appear in multithreading problems. Classic examples include the Dining Philosophers problem and the Producer-Consumer problem. Understanding how to use locks, try-locks, and lock ordering to prevent deadlocks in concurrent code is essential for senior engineering roles.`,
            summary: "• Deadlock occurs when processes wait circularly for resources held by each other\n• Four necessary conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait\n• Handling strategies: Prevention, Avoidance (Banker's Algorithm), Detection & Recovery\n• Apply to multithreading: Dining Philosophers, Producer-Consumer problems\n• Comparison tables help understand different deadlock handling approaches",
            topics: ["Coffman's Four Conditions", "Banker's Algorithm (Deadlock Avoidance)", "Resource Allocation Graph", "Deadlock Detection & Recovery", "Dining Philosophers Problem"],
            resources: [
                { title: "Deadlock in OS - GeeksforGeeks", url: "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-systems/" },
                { title: "Banker's Algorithm Explained", url: "https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/" },
                { title: "Deadlock - Gate Smashers", url: "https://www.youtube.com/watch?v=UVo9cGARJZI" }
            ],
            images: [],
            video_links: [
                { title: "Deadlock - Gate Smashers", url: "https://www.youtube.com/watch?v=UVo9cGARJZI" }
            ],
            interview_questions: [
                "What are the four necessary conditions for a deadlock to occur?",
                "Explain the Banker's Algorithm with an example.",
                "How would you prevent deadlocks in a multithreaded application?",
                "What is the difference between deadlock prevention and avoidance?"
            ],
            dsa_concepts: ["Graph (cycle detection for deadlock)", "Matrix (Banker's Algorithm)", "Topological Sort", "DFS (wait-for graph)"]
        }
    },
    dbms: {
        default: {
            answer: `Database Management Systems (DBMS) is a critical subject for software engineering interviews. It covers how data is stored, organized, retrieved, and manipulated efficiently. Key concepts include the relational model, SQL queries, normalization, transactions, indexing, and concurrency control.\n\nInterviewers focus heavily on **ACID properties** (Atomicity, Consistency, Isolation, Durability), **normalization** (1NF through BCNF), **SQL query writing** (joins, subqueries, aggregate functions), and **indexing** (B-Trees, B+ Trees, hash indexing). Understanding the difference between clustered and non-clustered indexes, and when to use each, is a common interview question.\n\nFor system design rounds, knowledge of database sharding, replication, CAP theorem, and the differences between SQL vs NoSQL databases is essential. Being able to design an efficient database schema for a given problem demonstrates strong engineering fundamentals.`,
            summary: "• DBMS covers data storage, organization, retrieval, and manipulation\n• Key interview topics: ACID properties, normalization, SQL, indexing\n• System design: sharding, replication, CAP theorem, SQL vs NoSQL\n• Design efficient database schemas for real-world problems",
            topics: ["ACID Properties & Transactions", "Normalization (1NF to BCNF)", "SQL Joins & Subqueries", "Indexing & Query Optimization", "Concurrency Control & Locking"],
            resources: [
                { title: "DBMS Complete Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/dbms/" },
                { title: "Database Systems - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBRMOs59NPhYl" },
                { title: "SQL Tutorial - W3Schools", url: "https://www.w3schools.com/sql/" }
            ],
            images: [],
            video_links: [
                { title: "Database Systems - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBRMOs59NPhYl" }
            ],
            interview_questions: [
                "Explain the different types of database normalization.",
                "What is the difference between clustered and non-clustered indexes?",
                "How do you optimize SQL query performance?",
                "Explain the CAP theorem and its implications for database design."
            ],
            dsa_concepts: ["B-Tree & B+ Tree (indexing)", "Hashing (hash index)", "Graph (ER diagrams)", "Sorting (ORDER BY operations)"]
        },
        acid: {
            answer: `ACID properties are the cornerstone of reliable database transactions. Every transaction in a DBMS must satisfy these four properties to ensure data integrity even in the face of system failures or concurrent access.

## The Four ACID Properties
**Atomicity** ensures a transaction is "all or nothing" — either all operations complete successfully, or none do (using undo logs/redo logs).
**Consistency** guarantees that a transaction takes the database from one valid state to another, maintaining all integrity constraints.
**Isolation** ensures concurrent transactions don't interfere with each other — implemented via locking protocols or MVCC (Multi-Version Concurrency Control).
**Durability** guarantees that once a transaction is committed, changes persist even after system crashes (using WAL — Write-Ahead Logging).

## ACID Properties Comparison
| Property | Purpose | Implementation | Common Issues | Example |
|----------|---------|----------------|---------------|---------|
| Atomicity | All-or-nothing execution | Undo/Redo logs, checkpoints | Partial commits | Bank transfer must complete fully |
| Consistency | Valid state transitions | Integrity constraints, triggers | Constraint violations | Account balance cannot be negative |
| Isolation | Concurrent transaction independence | Locking, MVCC | Dirty reads, phantom reads | Multiple users updating same data |
| Durability | Persistence of committed data | Write-Ahead Logging (WAL) | Data loss on crash | Committed order saved before crash |

## Transaction Isolation Levels
- **Read Uncommitted**: Lowest isolation, allows dirty reads
- **Read Committed**: Prevents dirty reads, allows non-repeatable reads
- **Repeatable Read**: Prevents dirty and non-repeatable reads, allows phantom reads
- **Serializable**: Highest isolation, prevents all concurrency issues

## Interview Preparation
In interviews, you'll be asked to explain each property with examples, discuss isolation levels, and explain phenomena like dirty reads, non-repeatable reads, and phantom reads. Understanding how databases implement ACID using logs and lock managers is what separates strong candidates.`,
            summary: "• ACID ensures database transactions are reliable and consistent\n• Atomicity: all-or-nothing | Consistency: valid state transitions\n• Isolation: concurrent transaction independence | Durability: committed data persists\n• Key implementations: WAL, MVCC, Two-Phase Locking\n• Structured headings and comparison tables for better understanding",
            topics: ["ACID Properties Deep Dive", "Transaction Isolation Levels", "Write-Ahead Logging (WAL)", "MVCC (Multi-Version Concurrency Control)", "Two-Phase Locking Protocol"],
            resources: [
                { title: "ACID Properties - GeeksforGeeks", url: "https://www.geeksforgeeks.org/acid-properties-in-dbms/" },
                { title: "Transaction Isolation Levels", url: "https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/" },
                { title: "Database Transactions - Hussein Nasser", url: "https://www.youtube.com/watch?v=pomxJOFVcQs" }
            ],
            images: [],
            video_links: [
                { title: "Database Transactions - Hussein Nasser", url: "https://www.youtube.com/watch?v=pomxJOFVcQs" }
            ],
            interview_questions: [
                "Explain each ACID property with a real-world example.",
                "What are the different transaction isolation levels and when would you use each?",
                "What is the difference between dirty reads, non-repeatable reads, and phantom reads?",
                "How does Write-Ahead Logging (WAL) ensure durability?"
            ],
            dsa_concepts: ["Logging (WAL implementation)", "Lock-based data structures", "Graph (serializability testing)", "Timestamp ordering"]
        }
    },
    oops: {
        default: {
            answer: `Object-Oriented Programming (OOP) is fundamental to most modern software development and is heavily tested in interviews. The four pillars — **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism** — form the foundation, but interviewers expect deep understanding of design principles and patterns.\n\n**Encapsulation** bundles data and methods, controlling access via access modifiers. **Abstraction** hides complexity and exposes only essential features through abstract classes and interfaces. **Inheritance** enables code reuse through "is-a" relationships, while **Polymorphism** allows objects to take multiple forms — compile-time (method overloading) and runtime (method overriding/virtual functions).\n\nBeyond the four pillars, interviewers test SOLID principles, design patterns (Singleton, Factory, Observer, Strategy), and practical OOP concepts like composition vs inheritance, interface segregation, and dependency injection. Being able to design a class hierarchy for real-world scenarios (parking lot, library system, elevator) is a common interview format.`,
            summary: "• OOP four pillars: Encapsulation, Abstraction, Inheritance, Polymorphism\n• Advanced topics: SOLID principles, design patterns, composition vs inheritance\n• Practical skills: design class hierarchies for real-world scenarios\n• Key concepts: access modifiers, abstract classes, interfaces, virtual functions",
            topics: ["Four Pillars of OOP", "SOLID Principles", "Design Patterns (Creational, Structural, Behavioral)", "Abstract Classes vs Interfaces", "Composition vs Inheritance"],
            resources: [
                { title: "OOP Concepts - GeeksforGeeks", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
                { title: "SOLID Principles Explained", url: "https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/" },
                { title: "Design Patterns - Refactoring Guru", url: "https://refactoring.guru/design-patterns" }
            ],
            images: [],
            video_links: [],
            interview_questions: [
                "Explain the four pillars of OOP with real-world examples.",
                "What is the difference between abstract classes and interfaces?",
                "Explain the SOLID principles and why they are important.",
                "Describe a design pattern you've used and when to use it."
            ],
            dsa_concepts: ["Class hierarchies (Trees)", "Polymorphism (Strategy pattern)", "Encapsulation (ADTs)", "Inheritance chains (DAG)"]
        },
        pillars: {
            answer: `The four pillars of Object-Oriented Programming (OOPs) are Encapsulation, Abstraction, Inheritance, and Polymorphism. Encapsulation refers to the concept of bundling data and methods that operate on that data within a single unit, called a class or object. Abstraction is the practice of showing only the necessary information to the outside world while hiding the internal details. Inheritance allows one class to inherit the properties and behavior of another class, promoting code reuse and a hierarchical organization of code. Polymorphism is the ability of an object to take on multiple forms, depending on the context in which it is used. For example, in Python, encapsulation can be demonstrated by defining a class with private attributes and public methods to access or modify those attributes. Abstraction can be shown through the use of abstract classes or interfaces that define a contract without specifying the implementation details. Inheritance can be illustrated by creating a subclass that inherits from a parent class and adds new attributes or overrides methods. Polymorphism can be demonstrated through method overriding or method overloading, where objects of different classes can respond to the same method call in different ways.`,
            summary: "• Four pillars: Encapsulation (data hiding), Abstraction (interface hiding), Inheritance (code reuse), Polymorphism (multiple forms)\n• Encapsulation: access modifiers, private fields, public methods\n• Abstraction: abstract classes, interfaces, hiding implementation\n• Inheritance: is-a relationships, careful with diamond problem\n• Polymorphism: compile-time (overloading) vs runtime (overriding)",
            topics: ["Encapsulation & Access Modifiers", "Abstract Classes & Interfaces", "Single vs Multiple Inheritance", "Method Overloading vs Overriding", "Virtual Functions & VTable"],
            resources: [
                { title: "4 Pillars of OOP - Programiz", url: "https://www.programiz.com/java-programming/oop" },
                { title: "OOP Interview Questions - InterviewBit", url: "https://www.interviewbit.com/oops-interview-questions/" },
                { title: "OOP Concepts - Kunal Kushwaha", url: "https://www.youtube.com/watch?v=BSVKUk58K68" }
            ],
            images: [],
            video_links: [
                { title: "OOP Concepts - Kunal Kushwaha", url: "https://www.youtube.com/watch?v=BSVKUk58K68" }
            ],
            interview_questions: [
                "Explain each pillar of OOP with a real-world example.",
                "What is the difference between method overloading and overriding?",
                "How does virtual function table (vtable) work in polymorphism?",
                "What is the diamond problem in multiple inheritance and how is it resolved?"
            ],
            dsa_concepts: ["Abstract Data Types (ADT)", "Virtual Table (vtable for polymorphism)", "Tree (class hierarchy)", "Interface-based design"]
        }
    },
    cn: {
        default: {
            answer: `Computer Networks (CN) is essential for understanding how modern distributed systems communicate. Interview questions focus on the OSI/TCP-IP models, protocols at each layer, and practical networking concepts used in real-world systems.\n\nThe **Application Layer** covers HTTP/HTTPS, DNS, SMTP, and FTP. The **Transport Layer** focuses on TCP vs UDP — connection-oriented vs connectionless, reliability mechanisms, flow control (sliding window), and congestion control. The **Network Layer** covers IP addressing, subnetting, routing algorithms (OSPF, BGP, RIP), and NAT. The **Data Link Layer** deals with MAC addressing, ARP, and error detection (CRC).\n\nFor interviews, be prepared to explain the TCP three-way handshake, how DNS resolution works, the difference between TCP and UDP with use cases, how HTTPS works (TLS/SSL handshake), and subnetting problems. System design interviews heavily rely on networking knowledge — understanding load balancers, CDNs, reverse proxies, and websockets is crucial.`,
            summary: "• CN focuses on OSI/TCP-IP models and protocols at each layer\n• Key protocols: HTTP/HTTPS, DNS, TCP/UDP, IP addressing, routing\n• Interview essentials: TCP handshake, DNS resolution, TLS, subnetting\n• System design: load balancers, CDNs, reverse proxies, websockets",
            topics: ["OSI vs TCP/IP Model", "TCP vs UDP Protocols", "DNS Resolution Process", "HTTP/HTTPS & TLS Handshake", "IP Addressing & Subnetting"],
            resources: [
                { title: "Computer Networks - GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
                { title: "CN Playlist - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_" },
                { title: "Networking Fundamentals - PowerCert", url: "https://www.youtube.com/watch?v=VwN91x5i25g" }
            ],
            images: [],
            video_links: [
                { title: "CN Playlist - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_" },
                { title: "Networking Fundamentals - PowerCert", url: "https://www.youtube.com/watch?v=VwN91x5i25g" }
            ],
            interview_questions: [
                "Explain the TCP three-way handshake and why it's needed.",
                "What is the difference between TCP and UDP, and when would you use each?",
                "How does DNS resolution work?",
                "Explain the OSI model and the function of each layer."
            ],
            dsa_concepts: ["Graph (routing algorithms)", "Sliding Window Protocol", "Hashing (checksums)", "Tree (DNS hierarchy)"]
        },
        tcp: {
            answer: `The TCP three-way handshake is a fundamental networking concept and one of the most asked interview questions. It establishes a reliable, full-duplex connection between client and server before data transfer begins.\n\n**Step 1 — SYN:** The client sends a TCP segment with the SYN flag set and an initial sequence number (ISN), say x. This indicates the client wants to establish a connection.\n\n**Step 2 — SYN-ACK:** The server responds with both SYN and ACK flags set. It acknowledges the client's sequence number (ACK = x+1) and sends its own initial sequence number, say y.\n\n**Step 3 — ACK:** The client sends an ACK segment acknowledging the server's sequence number (ACK = y+1). The connection is now established and data transfer can begin.\n\nThe connection teardown uses a **four-way handshake** (FIN → ACK → FIN → ACK) because each direction must be closed independently. Interview follow-ups include: What happens if a SYN is lost? (retransmission with exponential backoff), What is SYN flooding? (a DoS attack exploiting half-open connections, mitigated with SYN cookies), and the TIME_WAIT state purpose.`,
            summary: "• TCP three-way handshake: SYN → SYN-ACK → ACK establishes reliable connection\n• Connection teardown: four-way handshake (FIN → ACK → FIN → ACK)\n• Key concepts: flow control, congestion control, sliding window\n• Security: SYN flood attacks mitigated with SYN cookies",
            topics: ["TCP Three-Way Handshake", "TCP Connection Teardown", "SYN Flood Attack & SYN Cookies", "TCP Flow Control (Sliding Window)", "TCP Congestion Control (AIMD, Slow Start)"],
            resources: [
                { title: "TCP 3-Way Handshake - GeeksforGeeks", url: "https://www.geeksforgeeks.org/tcp-3-way-handshake-process/" },
                { title: "TCP Explained - Ben Eater", url: "https://www.youtube.com/watch?v=F27PLin3TV0" },
                { title: "TCP/IP Protocol - JavaTPoint", url: "https://www.javatpoint.com/tcp-ip-full-form" }
            ],
            images: [],
            video_links: [
                { title: "TCP Explained - Ben Eater", url: "https://www.youtube.com/watch?v=F27PLin3TV0" }
            ],
            interview_questions: [
                "Explain the TCP three-way handshake in detail.",
                "What is the difference between a three-way and four-way handshake?",
                "How does TCP handle flow control and congestion control?",
                "What is a SYN flood attack and how can it be prevented?"
            ],
            dsa_concepts: ["State Machine (TCP states)", "Sliding Window Algorithm", "Timer-based retransmission", "Queue (packet buffering)"]
        }
    },
    system_design: {
        default: {
            answer: `System Design interviews test your ability to architect scalable, reliable, and maintainable distributed systems. Unlike DS/Algo rounds, there's no single correct answer — interviewers evaluate your thought process, trade-off analysis, and breadth of knowledge.\n\nA structured approach works best: **1) Clarify requirements** (functional + non-functional), **2) Estimate scale** (QPS, storage, bandwidth), **3) Design high-level architecture** (API design, database choice, service decomposition), **4) Deep dive** into key components, **5) Address bottlenecks** (scaling, caching, monitoring).\n\nCommon system design topics include: URL Shortener, Twitter/Instagram Feed, Chat System (WhatsApp), Rate Limiter, Notification Service, Search Autocomplete, Video Streaming (YouTube/Netflix), and Distributed Cache. Key building blocks to master: load balancers, caches (Redis/Memcached), message queues (Kafka/RabbitMQ), CDNs, databases (SQL vs NoSQL), consistent hashing, and CAP theorem.`,
            summary: "• System design: architect scalable, reliable distributed systems\n• Structured approach: requirements → scale estimates → architecture → deep dive → bottlenecks\n• Key topics: URL shortener, feed systems, chat, rate limiting, video streaming\n• Building blocks: load balancers, caches, message queues, CDNs, databases",
            topics: ["Scalability & Load Balancing", "Caching Strategies (Write-through, Write-back, LRU)", "Database Sharding & Replication", "Message Queues & Event-Driven Architecture", "CAP Theorem & Consistency Models"],
            resources: [
                { title: "System Design Primer - GitHub", url: "https://github.com/donnemartin/system-design-primer" },
                { title: "Gaurav Sen - System Design Playlist", url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX" },
                { title: "System Design Interview - ByteByteGo", url: "https://bytebytego.com/" }
            ],
            images: [],
            video_links: [
                { title: "Gaurav Sen - System Design Playlist", url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX" }
            ],
            interview_questions: [
                "Design a URL shortener like bit.ly.",
                "Design a Twitter timeline/feed system.",
                "How would you design a rate limiter?",
                "Explain the CAP theorem and its implications."
            ],
            dsa_concepts: ["Consistent Hashing", "LRU Cache (LinkedHashMap)", "Trie (autocomplete)", "Graph (service dependency)"]
        },
        url: {
            answer: `Designing a URL shortener (like bit.ly) is a classic system design interview question. Here's a structured approach:\n\n**Functional Requirements:** Shorten long URLs, redirect short URLs to original, optional custom aliases, analytics (click count). **Non-functional:** High availability, low latency (<100ms), shortened URL should be as short as possible.\n\n**Scale Estimation:** 100M URLs/day write, 10:1 read:write ratio = 1B reads/day ≈ 12K QPS. Storage: 100M × 500 bytes = 50GB/day.\n\n**Design:** Use Base62 encoding (a-z, A-Z, 0-9) with a counter/unique ID generator. A 7-character Base62 string gives 62^7 ≈ 3.5 trillion unique URLs. Use a hash table or database to store mapping. API: POST /shorten {longUrl} → {shortUrl}, GET /{shortCode} → 301 redirect.\n\n**Deep Dive:** Use a distributed ID generator (Twitter Snowflake) for uniqueness. Cache hot URLs in Redis (80/20 rule). Use database sharding by hash of shortCode. Handle race conditions with DB unique constraints. Add rate limiting per API key to prevent abuse.`,
            summary: "• URL shortener: map long URLs to short codes for easy sharing\n• Scale: 100M writes/day, 1B reads/day, 50GB storage/day\n• Design: Base62 encoding, distributed ID generation, Redis caching, DB sharding\n• APIs: POST /shorten, GET /{shortCode} with 301 redirect",
            topics: ["Base62/Base64 Encoding", "Distributed ID Generation (Snowflake)", "Caching with Redis", "Database Sharding Strategies", "301 vs 302 Redirects"],
            resources: [
                { title: "URL Shortener Design - GeeksforGeeks", url: "https://www.geeksforgeeks.org/system-design-url-shortening-service/" },
                { title: "Designing TinyURL - Gaurav Sen", url: "https://www.youtube.com/watch?v=fMZMm_0ZhK4" },
                { title: "URL Shortener - ByteByteGo", url: "https://www.youtube.com/watch?v=VyBVMnFY_Xw" }
            ],
            images: [],
            video_links: [
                { title: "Designing TinyURL - Gaurav Sen", url: "https://www.youtube.com/watch?v=fMZMm_0ZhK4" },
                { title: "URL Shortener - ByteByteGo", url: "https://www.youtube.com/watch?v=VyBVMnFY_Xw" }
            ],
            interview_questions: [
                "How would you generate unique short codes for URLs?",
                "What database would you use and how would you shard it?",
                "How would you handle caching for frequently accessed URLs?",
                "What are the trade-offs between different encoding schemes?"
            ],
            dsa_concepts: ["Hash Map (URL mapping)", "Base62 Encoding (ID to string)", "Bloom Filter (duplicate checking)", "LRU Cache (hot URLs)"]
        }
    },
    se: {
        default: {
            answer: `Software Engineering (SE) in interviews goes beyond coding — it tests your understanding of the software development lifecycle, methodologies, testing strategies, and best practices for building maintainable software at scale.\n\n**SDLC Models:** Waterfall (sequential, good for well-defined projects), Agile (iterative, handles changing requirements), Spiral (risk-driven), V-Model (verification & validation). Most companies follow Agile/Scrum — understand sprints, user stories, daily standups, retrospectives, and Kanban boards.\n\n**Testing:** Unit testing, integration testing, system testing, acceptance testing. Know the testing pyramid — many unit tests, fewer integration tests, even fewer E2E tests. Understand TDD (Test-Driven Development) and BDD (Behavior-Driven Development). Code coverage metrics and mocking frameworks are practical skills.\n\n**Design Principles:** SOLID, DRY (Don't Repeat Yourself), KISS (Keep It Simple), YAGNI (You Aren't Gonna Need It). Version control (Git branching strategies), CI/CD pipelines, code reviews, and technical debt management are essential topics for senior roles.`,
            summary: "• SE covers SDLC, testing, design principles, and DevOps practices\n• SDLC models: Waterfall, Agile, Spiral, V-Model (most use Agile/Scrum)\n• Testing pyramid: unit → integration → E2E, TDD/BDD methodologies\n• Key principles: SOLID, DRY, KISS, YAGNI; Git, CI/CD, code reviews",
            topics: ["SDLC Models (Agile, Waterfall, Spiral)", "SOLID Design Principles", "Testing Strategies & TDD", "CI/CD & DevOps Practices", "Design Patterns & Code Quality"],
            resources: [
                { title: "Software Engineering - GeeksforGeeks", url: "https://www.geeksforgeeks.org/software-engineering/" },
                { title: "SDLC Models Explained - JavaTPoint", url: "https://www.javatpoint.com/software-engineering-sdlc-models" },
                { title: "Software Engineering Basics - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2" }
            ],
            images: [],
            video_links: [
                { title: "Software Engineering Basics - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2" }
            ],
            interview_questions: [
                "Explain the different SDLC models and when to use each.",
                "What is the testing pyramid and why is it important?",
                "Describe your experience with CI/CD pipelines.",
                "How do you handle technical debt in a project?"
            ],
            dsa_concepts: ["Graph (project scheduling, PERT/CPM)", "State Machine (workflow modeling)", "Tree (feature branching)", "Queue (CI/CD pipeline)"]
        }
    }
};

const SUBJECT_KEYWORDS: Record<string, string[]> = {
    os: ['process', 'thread', 'scheduling', 'deadlock', 'memory', 'paging', 'virtual memory', 'semaphore', 'mutex', 'kernel', 'system call', 'cpu', 'fcfs', 'round robin', 'sjf', 'operating system', 'page replacement', 'lru', 'fifo', 'context switch', 'ipc', 'pipe', 'fork'],
    dbms: ['database', 'sql', 'query', 'normalization', 'acid', 'transaction', 'index', 'join', 'key', 'primary', 'foreign', 'bcnf', 'nosql', 'schema', 'table', 'relational', 'mongodb', 'sharding', 'replication', 'er diagram', 'aggregate'],
    oops: ['oop', 'object oriented', 'class', 'inheritance', 'polymorphism', 'encapsulation', 'abstraction', 'interface', 'abstract', 'solid', 'design pattern', 'singleton', 'factory', 'observer', 'pillar', 'overloading', 'overriding', 'composition'],
    cn: ['network', 'tcp', 'udp', 'http', 'dns', 'ip', 'osi', 'protocol', 'routing', 'subnet', 'handshake', 'socket', 'port', 'firewall', 'ssl', 'tls', 'arp', 'mac', 'bandwidth', 'latency', 'cdn'],
    system_design: ['system design', 'scalab', 'load balancer', 'cache', 'distributed', 'microservice', 'api gateway', 'rate limit', 'url shortener', 'design a', 'architect', 'kafka', 'redis', 'message queue', 'cap theorem', 'consistent hashing', 'sharding'],
    se: ['software engineering', 'sdlc', 'agile', 'waterfall', 'scrum', 'testing', 'unit test', 'tdd', 'ci/cd', 'devops', 'sprint', 'kanban', 'code review', 'version control', 'git', 'deployment', 'dry', 'kiss', 'yagni']
};

const TOPIC_KEYWORDS: Record<string, Record<string, string[]>> = {
    os: { scheduling: ['scheduling', 'fcfs', 'round robin', 'sjf', 'srtf', 'priority', 'cpu scheduling', 'preemptive'], deadlock: ['deadlock', 'banker', 'coffman', 'circular wait', 'mutual exclusion', 'dining philosopher'] },
    dbms: { acid: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'transaction', 'commit', 'rollback'] },
    oops: { pillars: ['pillar', 'four pillar', 'encapsulation', 'abstraction', 'inheritance', 'polymorphism'] },
    cn: { tcp: ['tcp', 'handshake', 'syn', 'three-way', 'three way', 'connection'] },
    system_design: { url: ['url shortener', 'bit.ly', 'tinyurl', 'shorten'] }
};

function detectSubject(query: string, selectedSubject: string | 'all'): Subject {
    if (selectedSubject && selectedSubject !== 'all') return selectedSubject as Subject;
    const q = query.toLowerCase();
    let bestMatch: Subject | null = null;
    let bestScore = 0;
    
    for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
        const score = keywords.filter(kw => q.includes(kw)).length;
        if (score > bestScore) { 
            bestScore = score; 
            bestMatch = subject as Subject; 
        }
    }
    return bestMatch || 'os';
}

function detectTopic(query: string, subject: Subject): string {
    const q = query.toLowerCase();
    const topicMap = TOPIC_KEYWORDS[subject];
    if (!topicMap) return 'default';
    
    for (const [topic, keywords] of Object.entries(topicMap)) {
        if (keywords.some(kw => q.includes(kw))) return topic;
    }
    return 'default';
}

export function getMockResponse(query: string, selectedSubject: string | 'all'): MockResponse {
    const subject = detectSubject(query, selectedSubject);
    const topic = detectTopic(query, subject);
    const subjectData = MOCK_RESPONSES[subject] || MOCK_RESPONSES.os;
    const response = subjectData[topic] || subjectData.default;
    
    // Ensure all required fields are present with defaults
    return {
        ...response,
        summary: response.summary || "Key concepts and principles to understand for this topic.",
        images: response.images || [],
        video_links: response.video_links || [],
        interview_questions: response.interview_questions || []
    };
}
