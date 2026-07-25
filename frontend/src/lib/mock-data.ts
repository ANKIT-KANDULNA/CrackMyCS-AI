export interface MockResponse {
    answer: string;
    topics: string[];
    resources: { title: string; url: string }[];
    dsa_concepts: string[];
}

export type Subject = 'os' | 'dbms' | 'oops' | 'cn' | 'system_design' | 'se';

const MOCK_RESPONSES: Record<Subject, Record<string, MockResponse>> = {
    os: {
        default: {
            answer: `Operating Systems form the backbone of computer science interviews. An OS manages hardware resources and provides services to applications through system calls. Key areas include process management (scheduling, synchronization, deadlocks), memory management (paging, segmentation, virtual memory), file systems, and I/O management.\n\nInterviewers frequently test candidates on process vs thread differences, various CPU scheduling algorithms (FCFS, SJF, Round Robin, Priority), deadlock conditions and prevention strategies, and page replacement algorithms (FIFO, LRU, Optimal). Understanding these concepts deeply, along with their trade-offs, is crucial for cracking OS-related interview rounds.\n\nFor system design interviews, OS concepts like caching (page cache), concurrency (mutex, semaphores), and inter-process communication (pipes, shared memory, message queues) are directly applicable. Make sure to understand not just the theory but also real-world applications.`,
            topics: ["Process Scheduling & Synchronization", "Memory Management & Virtual Memory", "Deadlock Detection & Prevention", "File Systems & I/O Management", "Inter-Process Communication"],
            resources: [
                { title: "Operating System Concepts - GeeksforGeeks", url: "https://www.geeksforgeeks.org/operating-systems/" },
                { title: "OS Gate Notes - Gate Smashers (YouTube)", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p" },
                { title: "Neso Academy - OS Playlist", url: "https://www.youtube.com/playlist?list=PLBlnK6fEyqRiVhbXDGLXDk_OQAdc0cPiS" }
            ],
            dsa_concepts: ["Queue (for scheduling)", "Linked List (memory allocation)", "Graph (resource allocation)", "Semaphore & Mutex"]
        },
        scheduling: {
            answer: `Process scheduling is a fundamental OS concept that determines which process gets CPU time and when. The CPU scheduler selects from processes in the ready queue and allocates the CPU using various algorithms, each with different trade-offs between throughput, turnaround time, waiting time, and response time.\n\n**Non-Preemptive algorithms** include FCFS (First Come First Served) — simple but causes the convoy effect, and SJF (Shortest Job First) — optimal for average waiting time but requires knowing burst times in advance. **Preemptive algorithms** include SRTF (Shortest Remaining Time First), Round Robin (uses time quantum, great for time-sharing), and Priority Scheduling (can cause starvation, solved with aging).\n\nIn interviews, you'll often be asked to calculate Gantt charts, average waiting time, and turnaround time for given processes. Be ready to compare algorithms and explain when each is preferred. Multilevel Queue and Multilevel Feedback Queue are advanced schedulers used in real OS implementations like Linux CFS.`,
            topics: ["FCFS vs SJF vs Round Robin", "Preemptive vs Non-Preemptive Scheduling", "Multilevel Feedback Queue", "CPU Burst & I/O Burst Cycles", "Context Switching Overhead"],
            resources: [
                { title: "CPU Scheduling Algorithms - GeeksforGeeks", url: "https://www.geeksforgeeks.org/cpu-scheduling-in-operating-systems/" },
                { title: "Process Scheduling - Neso Academy", url: "https://www.youtube.com/watch?v=2h3eWaPx8SA" },
                { title: "CPU Scheduling Practice - JavaTPoint", url: "https://www.javatpoint.com/os-cpu-scheduling" }
            ],
            dsa_concepts: ["Priority Queue (priority scheduling)", "Circular Queue (Round Robin)", "Queue (FCFS)", "Sorting (SJF)"]
        },
        deadlock: {
            answer: `Deadlock is a situation where two or more processes are blocked forever, each waiting for a resource held by another. It's one of the most frequently asked OS interview topics. A deadlock occurs when all four Coffman conditions are met simultaneously: **Mutual Exclusion**, **Hold and Wait**, **No Preemption**, and **Circular Wait**.\n\n**Prevention** strategies break one of the four conditions — for example, requiring processes to request all resources at once (breaking Hold & Wait) or imposing a total ordering on resources (breaking Circular Wait). **Avoidance** uses algorithms like the Banker's Algorithm, which checks if granting a resource request leads to a safe state. **Detection** uses a wait-for graph or resource allocation graph.\n\nIn coding interviews, deadlock concepts appear in multithreading problems. Classic examples include the Dining Philosophers problem and the Producer-Consumer problem. Understanding how to use locks, try-locks, and lock ordering to prevent deadlocks in concurrent code is essential for senior engineering roles.`,
            topics: ["Coffman's Four Conditions", "Banker's Algorithm (Deadlock Avoidance)", "Resource Allocation Graph", "Deadlock Detection & Recovery", "Dining Philosophers Problem"],
            resources: [
                { title: "Deadlock in OS - GeeksforGeeks", url: "https://www.geeksforgeeks.org/introduction-of-deadlock-in-operating-systems/" },
                { title: "Banker's Algorithm Explained", url: "https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/" },
                { title: "Deadlock - Gate Smashers", url: "https://www.youtube.com/watch?v=UVo9cGARJZI" }
            ],
            dsa_concepts: ["Graph (cycle detection for deadlock)", "Matrix (Banker's Algorithm)", "Topological Sort", "DFS (wait-for graph)"]
        }
    },
    dbms: {
        default: {
            answer: `Database Management Systems (DBMS) is a critical subject for software engineering interviews. It covers how data is stored, organized, retrieved, and manipulated efficiently. Key concepts include the relational model, SQL queries, normalization, transactions, indexing, and concurrency control.\n\nInterviewers focus heavily on **ACID properties** (Atomicity, Consistency, Isolation, Durability), **normalization** (1NF through BCNF), **SQL query writing** (joins, subqueries, aggregate functions), and **indexing** (B-Trees, B+ Trees, hash indexing). Understanding the difference between clustered and non-clustered indexes, and when to use each, is a common interview question.\n\nFor system design rounds, knowledge of database sharding, replication, CAP theorem, and the differences between SQL vs NoSQL databases is essential. Being able to design an efficient database schema for a given problem demonstrates strong engineering fundamentals.`,
            topics: ["ACID Properties & Transactions", "Normalization (1NF to BCNF)", "SQL Joins & Subqueries", "Indexing & Query Optimization", "Concurrency Control & Locking"],
            resources: [
                { title: "DBMS Complete Tutorial - GeeksforGeeks", url: "https://www.geeksforgeeks.org/dbms/" },
                { title: "Database Systems - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiFAN6I8CuViBRMOs59NPhYl" },
                { title: "SQL Tutorial - W3Schools", url: "https://www.w3schools.com/sql/" }
            ],
            dsa_concepts: ["B-Tree & B+ Tree (indexing)", "Hashing (hash index)", "Graph (ER diagrams)", "Sorting (ORDER BY operations)"]
        },
        acid: {
            answer: `ACID properties are the cornerstone of reliable database transactions. Every transaction in a DBMS must satisfy these four properties to ensure data integrity even in the face of system failures or concurrent access.\n\n**Atomicity** ensures a transaction is "all or nothing" — either all operations complete successfully, or none do (using undo logs/redo logs). **Consistency** guarantees that a transaction takes the database from one valid state to another, maintaining all integrity constraints. **Isolation** ensures concurrent transactions don't interfere with each other — implemented via locking protocols or MVCC (Multi-Version Concurrency Control). **Durability** guarantees that once a transaction is committed, changes persist even after system crashes (using WAL — Write-Ahead Logging).\n\nIn interviews, you'll be asked to explain each property with examples, discuss isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable), and explain phenomena like dirty reads, non-repeatable reads, and phantom reads. Understanding how databases implement ACID using logs and lock managers is what separates strong candidates.`,
            topics: ["ACID Properties Deep Dive", "Transaction Isolation Levels", "Write-Ahead Logging (WAL)", "MVCC (Multi-Version Concurrency Control)", "Two-Phase Locking Protocol"],
            resources: [
                { title: "ACID Properties - GeeksforGeeks", url: "https://www.geeksforgeeks.org/acid-properties-in-dbms/" },
                { title: "Transaction Isolation Levels", url: "https://www.geeksforgeeks.org/transaction-isolation-levels-dbms/" },
                { title: "Database Transactions - Hussein Nasser", url: "https://www.youtube.com/watch?v=pomxJOFVcQs" }
            ],
            dsa_concepts: ["Logging (WAL implementation)", "Lock-based data structures", "Graph (serializability testing)", "Timestamp ordering"]
        }
    },
    oops: {
        default: {
            answer: `Object-Oriented Programming (OOP) is fundamental to most modern software development and is heavily tested in interviews. The four pillars — **Encapsulation**, **Abstraction**, **Inheritance**, and **Polymorphism** — form the foundation, but interviewers expect deep understanding of design principles and patterns.\n\n**Encapsulation** bundles data and methods, controlling access via access modifiers. **Abstraction** hides complexity and exposes only essential features through abstract classes and interfaces. **Inheritance** enables code reuse through "is-a" relationships, while **Polymorphism** allows objects to take multiple forms — compile-time (method overloading) and runtime (method overriding/virtual functions).\n\nBeyond the four pillars, interviewers test SOLID principles, design patterns (Singleton, Factory, Observer, Strategy), and practical OOP concepts like composition vs inheritance, interface segregation, and dependency injection. Being able to design a class hierarchy for real-world scenarios (parking lot, library system, elevator) is a common interview format.`,
            topics: ["Four Pillars of OOP", "SOLID Principles", "Design Patterns (Creational, Structural, Behavioral)", "Abstract Classes vs Interfaces", "Composition vs Inheritance"],
            resources: [
                { title: "OOP Concepts - GeeksforGeeks", url: "https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/" },
                { title: "SOLID Principles Explained", url: "https://www.geeksforgeeks.org/solid-principle-in-programming-understand-with-real-life-examples/" },
                { title: "Design Patterns - Refactoring Guru", url: "https://refactoring.guru/design-patterns" }
            ],
            dsa_concepts: ["Class hierarchies (Trees)", "Polymorphism (Strategy pattern)", "Encapsulation (ADTs)", "Inheritance chains (DAG)"]
        },
        pillars: {
            answer: `The four pillars of OOP are the most commonly asked topic in programming interviews. Let's break each down with practical examples:\n\n**1. Encapsulation:** Wrapping data (fields) and methods into a single unit (class) with controlled access. Example: A \`BankAccount\` class with private \`balance\` field and public \`deposit()\`/\`withdraw()\` methods. The internal state is protected from direct external modification.\n\n**2. Abstraction:** Hiding implementation complexity and showing only the interface. Example: A \`Shape\` abstract class with an abstract \`area()\` method — Circle, Rectangle implement it differently. Users call \`shape.area()\` without knowing the internal formula.\n\n**3. Inheritance:** Creating new classes from existing ones, inheriting properties and behaviors. Example: \`Vehicle → Car → ElectricCar\`. Enables code reuse and establishes "is-a" relationships. Be careful of the diamond problem in multiple inheritance.\n\n**4. Polymorphism:** Objects behaving differently based on their type. **Compile-time** (overloading): \`add(int, int)\` vs \`add(float, float)\`. **Runtime** (overriding): A \`Dog\` and \`Cat\` both override \`Animal.speak()\` — calling \`animal.speak()\` invokes the correct implementation based on actual object type.`,
            topics: ["Encapsulation & Access Modifiers", "Abstract Classes & Interfaces", "Single vs Multiple Inheritance", "Method Overloading vs Overriding", "Virtual Functions & VTable"],
            resources: [
                { title: "4 Pillars of OOP - Programiz", url: "https://www.programiz.com/java-programming/oop" },
                { title: "OOP Interview Questions - InterviewBit", url: "https://www.interviewbit.com/oops-interview-questions/" },
                { title: "OOP Concepts - Kunal Kushwaha", url: "https://www.youtube.com/watch?v=BSVKUk58K68" }
            ],
            dsa_concepts: ["Abstract Data Types (ADT)", "Virtual Table (vtable for polymorphism)", "Tree (class hierarchy)", "Interface-based design"]
        }
    },
    cn: {
        default: {
            answer: `Computer Networks (CN) is essential for understanding how modern distributed systems communicate. Interview questions focus on the OSI/TCP-IP models, protocols at each layer, and practical networking concepts used in real-world systems.\n\nThe **Application Layer** covers HTTP/HTTPS, DNS, SMTP, and FTP. The **Transport Layer** focuses on TCP vs UDP — connection-oriented vs connectionless, reliability mechanisms, flow control (sliding window), and congestion control. The **Network Layer** covers IP addressing, subnetting, routing algorithms (OSPF, BGP, RIP), and NAT. The **Data Link Layer** deals with MAC addressing, ARP, and error detection (CRC).\n\nFor interviews, be prepared to explain the TCP three-way handshake, how DNS resolution works, the difference between TCP and UDP with use cases, how HTTPS works (TLS/SSL handshake), and subnetting problems. System design interviews heavily rely on networking knowledge — understanding load balancers, CDNs, reverse proxies, and websockets is crucial.`,
            topics: ["OSI vs TCP/IP Model", "TCP vs UDP Protocols", "DNS Resolution Process", "HTTP/HTTPS & TLS Handshake", "IP Addressing & Subnetting"],
            resources: [
                { title: "Computer Networks - GeeksforGeeks", url: "https://www.geeksforgeeks.org/computer-network-tutorials/" },
                { title: "CN Playlist - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiGFBD2-2joCpWOLUrDLvVV_" },
                { title: "Networking Fundamentals - PowerCert", url: "https://www.youtube.com/watch?v=VwN91x5i25g" }
            ],
            dsa_concepts: ["Graph (routing algorithms)", "Sliding Window Protocol", "Hashing (checksums)", "Tree (DNS hierarchy)"]
        },
        tcp: {
            answer: `The TCP three-way handshake is a fundamental networking concept and one of the most asked interview questions. It establishes a reliable, full-duplex connection between client and server before data transfer begins.\n\n**Step 1 — SYN:** The client sends a TCP segment with the SYN flag set and an initial sequence number (ISN), say x. This indicates the client wants to establish a connection.\n\n**Step 2 — SYN-ACK:** The server responds with both SYN and ACK flags set. It acknowledges the client's sequence number (ACK = x+1) and sends its own initial sequence number, say y.\n\n**Step 3 — ACK:** The client sends an ACK segment acknowledging the server's sequence number (ACK = y+1). The connection is now established and data transfer can begin.\n\nThe connection teardown uses a **four-way handshake** (FIN → ACK → FIN → ACK) because each direction must be closed independently. Interview follow-ups include: What happens if a SYN is lost? (retransmission with exponential backoff), What is SYN flooding? (a DoS attack exploiting half-open connections, mitigated with SYN cookies), and the TIME_WAIT state purpose.`,
            topics: ["TCP Three-Way Handshake", "TCP Connection Teardown", "SYN Flood Attack & SYN Cookies", "TCP Flow Control (Sliding Window)", "TCP Congestion Control (AIMD, Slow Start)"],
            resources: [
                { title: "TCP 3-Way Handshake - GeeksforGeeks", url: "https://www.geeksforgeeks.org/tcp-3-way-handshake-process/" },
                { title: "TCP Explained - Ben Eater", url: "https://www.youtube.com/watch?v=F27PLin3TV0" },
                { title: "TCP/IP Protocol - JavaTPoint", url: "https://www.javatpoint.com/tcp-ip-full-form" }
            ],
            dsa_concepts: ["State Machine (TCP states)", "Sliding Window Algorithm", "Timer-based retransmission", "Queue (packet buffering)"]
        }
    },
    system_design: {
        default: {
            answer: `System Design interviews test your ability to architect scalable, reliable, and maintainable distributed systems. Unlike DS/Algo rounds, there's no single correct answer — interviewers evaluate your thought process, trade-off analysis, and breadth of knowledge.\n\nA structured approach works best: **1) Clarify requirements** (functional + non-functional), **2) Estimate scale** (QPS, storage, bandwidth), **3) Design high-level architecture** (API design, database choice, service decomposition), **4) Deep dive** into key components, **5) Address bottlenecks** (scaling, caching, monitoring).\n\nCommon system design topics include: URL Shortener, Twitter/Instagram Feed, Chat System (WhatsApp), Rate Limiter, Notification Service, Search Autocomplete, Video Streaming (YouTube/Netflix), and Distributed Cache. Key building blocks to master: load balancers, caches (Redis/Memcached), message queues (Kafka/RabbitMQ), CDNs, databases (SQL vs NoSQL), consistent hashing, and CAP theorem.`,
            topics: ["Scalability & Load Balancing", "Caching Strategies (Write-through, Write-back, LRU)", "Database Sharding & Replication", "Message Queues & Event-Driven Architecture", "CAP Theorem & Consistency Models"],
            resources: [
                { title: "System Design Primer - GitHub", url: "https://github.com/donnemartin/system-design-primer" },
                { title: "Gaurav Sen - System Design Playlist", url: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX" },
                { title: "System Design Interview - ByteByteGo", url: "https://bytebytego.com/" }
            ],
            dsa_concepts: ["Consistent Hashing", "LRU Cache (LinkedHashMap)", "Trie (autocomplete)", "Graph (service dependency)"]
        },
        url: {
            answer: `Designing a URL shortener (like bit.ly) is a classic system design interview question. Here's a structured approach:\n\n**Functional Requirements:** Shorten long URLs, redirect short URLs to original, optional custom aliases, analytics (click count). **Non-functional:** High availability, low latency (<100ms), shortened URL should be as short as possible.\n\n**Scale Estimation:** 100M URLs/day write, 10:1 read:write ratio = 1B reads/day ≈ 12K QPS. Storage: 100M × 500 bytes = 50GB/day.\n\n**Design:** Use Base62 encoding (a-z, A-Z, 0-9) with a counter/unique ID generator. A 7-character Base62 string gives 62^7 ≈ 3.5 trillion unique URLs. Use a hash table or database to store mapping. API: POST /shorten {longUrl} → {shortUrl}, GET /{shortCode} → 301 redirect.\n\n**Deep Dive:** Use a distributed ID generator (Twitter Snowflake) for uniqueness. Cache hot URLs in Redis (80/20 rule). Use database sharding by hash of shortCode. Handle race conditions with DB unique constraints. Add rate limiting per API key to prevent abuse.`,
            topics: ["Base62/Base64 Encoding", "Distributed ID Generation (Snowflake)", "Caching with Redis", "Database Sharding Strategies", "301 vs 302 Redirects"],
            resources: [
                { title: "URL Shortener Design - GeeksforGeeks", url: "https://www.geeksforgeeks.org/system-design-url-shortening-service/" },
                { title: "Designing TinyURL - Gaurav Sen", url: "https://www.youtube.com/watch?v=fMZMm_0ZhK4" },
                { title: "URL Shortener - ByteByteGo", url: "https://www.youtube.com/watch?v=VyBVMnFY_Xw" }
            ],
            dsa_concepts: ["Hash Map (URL mapping)", "Base62 Encoding (ID to string)", "Bloom Filter (duplicate checking)", "LRU Cache (hot URLs)"]
        }
    },
    se: {
        default: {
            answer: `Software Engineering (SE) in interviews goes beyond coding — it tests your understanding of the software development lifecycle, methodologies, testing strategies, and best practices for building maintainable software at scale.\n\n**SDLC Models:** Waterfall (sequential, good for well-defined projects), Agile (iterative, handles changing requirements), Spiral (risk-driven), V-Model (verification & validation). Most companies follow Agile/Scrum — understand sprints, user stories, daily standups, retrospectives, and Kanban boards.\n\n**Testing:** Unit testing, integration testing, system testing, acceptance testing. Know the testing pyramid — many unit tests, fewer integration tests, even fewer E2E tests. Understand TDD (Test-Driven Development) and BDD (Behavior-Driven Development). Code coverage metrics and mocking frameworks are practical skills.\n\n**Design Principles:** SOLID, DRY (Don't Repeat Yourself), KISS (Keep It Simple), YAGNI (You Aren't Gonna Need It). Version control (Git branching strategies), CI/CD pipelines, code reviews, and technical debt management are essential topics for senior roles.`,
            topics: ["SDLC Models (Agile, Waterfall, Spiral)", "SOLID Design Principles", "Testing Strategies & TDD", "CI/CD & DevOps Practices", "Design Patterns & Code Quality"],
            resources: [
                { title: "Software Engineering - GeeksforGeeks", url: "https://www.geeksforgeeks.org/software-engineering/" },
                { title: "SDLC Models Explained - JavaTPoint", url: "https://www.javatpoint.com/software-engineering-sdlc-models" },
                { title: "Software Engineering Basics - Gate Smashers", url: "https://www.youtube.com/playlist?list=PLxCzCOWd7aiEed7SKZBnC6ypFDWYLRvB2" }
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
    return subjectData[topic] || subjectData.default;
}
