import {
  BrainCircuit,
  Settings,
  Database,
  Code2,
  Network,
  Server,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type SubjectId = "os" | "dbms" | "oops" | "cn" | "system_design" | "se";
export type ChatSubjectId = SubjectId | "all";

export const BACKEND_SUBJECTS: Record<ChatSubjectId, string> = {
  all: "System Design",
  os: "OS",
  dbms: "DBMS",
  oops: "OOPs",
  cn: "CN",
  system_design: "System Design",
  se: "Software Engineering",
};

export const SUBJECT_SLUGS: Record<SubjectId, string> = {
  os: "os",
  dbms: "dbms",
  oops: "oops",
  cn: "cn",
  system_design: "system-design",
  se: "se",
};

const SLUG_TO_SUBJECT: Record<string, SubjectId> = Object.fromEntries(
  Object.entries(SUBJECT_SLUGS).map(([id, slug]) => [slug, id as SubjectId])
) as Record<string, SubjectId>;

export function slugToSubjectId(slug: string): SubjectId | null {
  return SLUG_TO_SUBJECT[slug] ?? null;
}

export function subjectIdToSlug(id: SubjectId): string {
  return SUBJECT_SLUGS[id];
}

export function getSubjectRoute(id: SubjectId): string {
  return `/${subjectIdToSlug(id)}`;
}

export type SubjectConfig = {
  id: ChatSubjectId;
  label: string;
  icon: LucideIcon;
  desc: string;
  route?: string;
};

export const SUBJECTS: SubjectConfig[] = [
  { id: "all", label: "All Subjects", icon: BrainCircuit, desc: "Explore everything", route: "/chat" },
  { id: "os", label: "Operating Systems", icon: Settings, desc: "Processes, memory, scheduling", route: "/os" },
  { id: "dbms", label: "DBMS", icon: Database, desc: "SQL, ACID, indexing", route: "/dbms" },
  { id: "oops", label: "OOPs", icon: Code2, desc: "Design patterns, SOLID", route: "/oops" },
  { id: "cn", label: "Computer Networks", icon: Network, desc: "TCP/IP, DNS, routing", route: "/cn" },
  {
    id: "system_design",
    label: "System Design",
    icon: Server,
    desc: "Scale, cache, queues",
    route: "/system-design",
  },
  { id: "se", label: "Software Engineering", icon: BookOpen, desc: "SDLC, testing, CI/CD", route: "/se" },
];

export const CHAT_SUBJECTS = SUBJECTS.filter((s) => s.id !== "all");
export const VALID_SUBJECT_SLUGS = Object.values(SUBJECT_SLUGS);

export const QUICK_PROMPTS = [
  "Explain process scheduling algorithms and compare them",
  "What are ACID properties in DBMS? Explain with examples",
  "Explain the four pillars of OOPs with code examples",
  "How does TCP three-way handshake work?",
  "Design a URL shortener like bit.ly from scratch",
  "What is deadlock? Explain prevention and avoidance",
];

export const SUBJECT_QUICK_PROMPTS: Partial<Record<SubjectId, string[]>> = {
  os: [
    "Explain process scheduling algorithms and compare them",
    "What is deadlock? Explain prevention and avoidance",
    "Explain paging vs segmentation in memory management",
  ],
  dbms: [
    "What are ACID properties in DBMS? Explain with examples",
    "Explain normalization forms from 1NF to BCNF",
    "What is the difference between clustered and non-clustered indexes?",
  ],
  oops: [
    "Explain the four pillars of OOPs with code examples",
    "What are SOLID principles? Explain with examples",
    "Explain common design patterns: Factory, Singleton, Observer",
  ],
  cn: [
    "How does TCP three-way handshake work?",
    "Explain the OSI model vs TCP/IP model",
    "What is the difference between TCP and UDP?",
  ],
  system_design: [
    "Design a URL shortener like bit.ly from scratch",
    "How would you design a rate limiter?",
    "Explain consistent hashing and its use cases",
  ],
  se: [
    "Explain the SDLC phases and common methodologies",
    "What is the difference between unit, integration, and e2e testing?",
    "Explain CI/CD pipeline best practices",
  ],
};
