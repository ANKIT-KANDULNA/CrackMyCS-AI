"use client";

import { useState, useRef, useEffect } from "react";
import { getMockResponse, type MockResponse } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Send, Menu, X, PlusCircle, Database, Settings, Code2, Network,
  Server, BookOpen, BrainCircuit, ExternalLink, MessageSquare,
  ArrowRight, Zap, Layers, Sparkles, Check, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  response?: MockResponse;
}

const BACKEND_SUBJECTS: Record<string, string> = {
  all: "System Design",
  os: "OS",
  dbms: "DBMS",
  oops: "OOPs",
  cn: "CN",
  system_design: "System Design",
  se: "Software Engineering",
};

const SUBJECTS = [
  { id: "all", label: "All Subjects", icon: BrainCircuit, desc: "Explore everything" },
  { id: "os", label: "Operating Systems", icon: Settings, desc: "Processes, memory, scheduling" },
  { id: "dbms", label: "DBMS", icon: Database, desc: "SQL, ACID, indexing" },
  { id: "oops", label: "OOPs", icon: Code2, desc: "Design patterns, SOLID" },
  { id: "cn", label: "Computer Networks", icon: Network, desc: "TCP/IP, DNS, routing" },
  { id: "system_design", label: "System Design", icon: Server, desc: "Scale, cache, queues" },
  { id: "se", label: "Software Engineering", icon: BookOpen, desc: "SDLC, testing, CI/CD" },
] as const;

const QUICK_PROMPTS = [
  "Explain process scheduling algorithms and compare them",
  "What are ACID properties in DBMS? Explain with examples",
  "Explain the four pillars of OOPs with code examples",
  "How does TCP three-way handshake work?",
  "Design a URL shortener like bit.ly from scratch",
  "What is deadlock? Explain prevention and avoidance",
];

// ─── Landing Page ────────────────────────────────────────────────────────────

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">CrackMyCS</span>
          <span className="text-[0.58rem] font-bold tracking-wider text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">AI</span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/ANKIT-KANDULNA/CrackMyCS-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium"
          >
            <GithubIcon /> GitHub
          </a>
          <button
            onClick={onStart}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-700 transition-all duration-200"
          >
            Open App
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(79,70,229,0.07),transparent)] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-300/40 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 border border-indigo-200/70 rounded-full text-sm font-medium text-indigo-700 mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            RAG-Powered · LangChain + Groq + FAISS
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-[4.5rem] font-black text-slate-900 leading-[1.05] tracking-[-0.03em] mb-6"
          >
            Crack every{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              CS Interview
            </span>
            <br />
            with your knowledge base.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Ask anything about OS, DBMS, OOPs, Computer Networks, System Design &amp; Software Engineering.
            Get structured, interview-ready answers — grounded in your own curated study material.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={onStart}
              className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all duration-200 text-[0.95rem]"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 text-[0.95rem]"
            >
              See features
            </a>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-5 mt-10 text-sm text-slate-400"
          >
            {["Open Source", "No Sign-up Required", "Runs Locally"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── Hero Preview Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative max-w-3xl mx-auto mt-20"
        >
          {/* Glow */}
          <div className="absolute -inset-4 bg-gradient-to-b from-indigo-500/10 via-blue-500/5 to-transparent blur-3xl rounded-3xl pointer-events-none" />
          <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-300/40 overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-50 border-b border-slate-100">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/80" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex-1 mx-4">
                <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-400 max-w-xs">
                  crackmycs.ai/chat
                </div>
              </div>
            </div>
            {/* Chat preview */}
            <div className="p-6 bg-slate-50/60 space-y-4 min-h-[200px]">
              <div className="flex justify-end">
                <div className="bg-indigo-600 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs shadow-sm">
                  What are ACID properties in DBMS?
                </div>
              </div>
              <div className="flex gap-3 max-w-2xl">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  AI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-700 shadow-sm leading-relaxed">
                  <p className="mb-3">
                    <strong className="text-slate-900">ACID properties</strong> are the cornerstone of reliable database transactions —
                    Atomicity, Consistency, Isolation, and Durability...
                  </p>
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {["Transactions", "MVCC", "WAL", "Isolation Levels"].map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium flex items-center gap-1">
                      <Database className="w-2.5 h-2.5" /> dbms.md
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Features Bento ── */}
      <section id="features" className="py-24 px-6 bg-slate-50/70">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em]">Features</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
              Everything you need to prepare
            </h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Built for serious CS interview prep. Not just another chatbot.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Large — RAG */}
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">RAG-Powered Intelligence</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
                Your questions are answered using your own curated knowledge base — not generic AI training data.
                The AI retrieves the most relevant documents first, then generates a grounded, accurate answer.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: "01", label: "Retrieve", icon: Database },
                  { num: "02", label: "Augment", icon: Layers },
                  { num: "03", label: "Generate", icon: Sparkles },
                ].map(({ num, label, icon: Icon }) => (
                  <div key={num} className="flex flex-col items-center p-3 bg-indigo-50 rounded-2xl border border-indigo-100/80">
                    <span className="text-xl font-black text-indigo-400 mb-0.5">{num}</span>
                    <Icon className="w-4 h-4 text-indigo-600 mb-1" />
                    <span className="text-xs font-semibold text-indigo-700">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sources Always Cited</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                See exactly which files from your knowledge base were used. Zero guesswork.
              </p>
              <div className="flex flex-col gap-1.5">
                {["os.md", "dbms.txt", "cn.md", "system_design.md"].map((f) => (
                  <span key={f} className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-medium flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Blazing Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Powered by Groq&apos;s ultra-fast LLM inference. Complete, structured answers arrive in seconds, not minutes.
              </p>
            </div>

            {/* 6 Subjects */}
            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">6 Core CS Subjects</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">Everything you need for a complete interview prep cycle.</p>
              <div className="grid grid-cols-2 gap-1.5">
                {["OS", "DBMS", "OOPs", "CN", "System Design", "SE"].map((s) => (
                  <span key={s} className="text-xs px-2 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-semibold text-center border border-blue-100">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Interview format — gradient card */}
            <div className="md:col-span-1 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl p-7 shadow-md hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5 transition-all duration-300 group text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interview-Ready Format</h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Structured answers with related topics, curated resources, and DSA connections — exactly what interviewers want to hear.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-[0.15em]">How It Works</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">
              From question to answer in seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-indigo-200 via-blue-200 to-indigo-200" />

            {[
              {
                icon: MessageSquare,
                title: "Ask Your Question",
                desc: "Type any CS interview question. The AI auto-detects the subject area and retrieves the right context.",
              },
              {
                icon: Search,
                title: "Knowledge Base Search",
                desc: "FAISS vector search finds the most semantically similar content from your local study files instantly.",
              },
              {
                icon: Check,
                title: "Get a Structured Answer",
                desc: "The LLM generates a crisp, interview-ready response with topics, resources, and cited source files.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className="text-center"
                >
                  <div className="relative inline-block">
                    <div className="w-20 h-20 rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-indigo-600" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[0.6rem] font-black flex items-center justify-center shadow-md shadow-indigo-500/30">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-line-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-[1.1] tracking-tight">
              Ready to ace your<br />CS interview?
            </h2>
            <p className="text-indigo-200 text-lg mb-10 max-w-md mx-auto">
              Start asking questions right now — no account, no setup, no friction.
            </p>
            <button
              onClick={onStart}
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 text-base"
            >
              Start Chatting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">CrackMyCS AI</span>
          </div>
          <p className="text-slate-400 text-xs">Built with Next.js · LangChain · Groq · FAISS · HuggingFace Embeddings</p>
          <a
            href="https://github.com/ANKIT-KANDULNA/CrackMyCS-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-800 transition-colors flex items-center gap-1.5 text-sm font-medium"
          >
            <GithubIcon /> View on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

// ─── Chat Interface ───────────────────────────────────────────────────────────

function ChatInterface({ onBack }: { onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<string>("all");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageIdRef = useRef(0);

  const createMessageId = () => {
    messageIdRef.current += 1;
    return `message-${messageIdRef.current}`;
  };

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({ top: chatAreaRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: createMessageId(), type: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    if (inputRef.current) inputRef.current.style.height = "auto";

    try {
      const localApiUrl =
        typeof window !== "undefined" && window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : "";
      const apiUrl = (process.env.NEXT_PUBLIC_API_URL || localApiUrl).replace(/\/$/, "");

      if (!apiUrl) throw new Error("API URL is not configured");

      const res = await fetch(`${apiUrl}/api/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text, subject: BACKEND_SUBJECTS[currentSubject] || "System Design" }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages((prev) => [...prev, { id: createMessageId(), type: "ai", content: data.answer, response: data }]);
    } catch {
      const fallback = getMockResponse(text, currentSubject);
      setMessages((prev) => [...prev, { id: createMessageId(), type: "ai", content: fallback.answer, response: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentSubjectLabel = SUBJECTS.find((s) => s.id === currentSubject)?.label || "All Subjects";

  const formatText = (text: string) =>
    text.split("\n").map((paragraph, idx) => {
      if (!paragraph.trim()) return null;
      const parts = paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return <strong key={i} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>;
        const codeParts = part.split(/(`.*?`)/).map((cp, j) => {
          if (cp.startsWith("`") && cp.endsWith("`"))
            return <code key={j} className="bg-slate-100 px-1.5 py-0.5 rounded-md text-[0.8rem] font-mono text-indigo-600">{cp.slice(1, -1)}</code>;
          return cp;
        });
        return <span key={i}>{codeParts}</span>;
      });
      return <p key={idx} className="mb-2.5 last:mb-0">{parts}</p>;
    });

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-xl md:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">CrackMyCS</div>
              <div className="text-[0.58rem] font-bold tracking-wider text-indigo-600 uppercase">AI Assistant</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onBack}
              className="px-2.5 py-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs font-semibold"
              title="Back to Home"
            >
              ← Home
            </button>
            <button className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[0.6rem] font-bold text-slate-400 tracking-[0.12em] uppercase mb-2 px-2 mt-1">Subjects</p>
          <nav className="flex flex-col gap-0.5 mb-5">
            {SUBJECTS.map(({ id, label, icon: Icon, desc }) => {
              const isActive = currentSubject === id;
              return (
                <button
                  key={id}
                  onClick={() => { setCurrentSubject(id); setIsSidebarOpen(false); }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative text-left w-full",
                    isActive
                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-gradient-to-b from-indigo-500 to-blue-500 rounded-r-full" />
                  )}
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate">{label}</div>
                    <div className="text-[0.62rem] text-slate-400 font-normal truncate">{desc}</div>
                  </div>
                </button>
              );
            })}
          </nav>

          <p className="text-[0.6rem] font-bold text-slate-400 tracking-[0.12em] uppercase mb-2 px-2">Quick Prompts</p>
          <div className="flex flex-col gap-0.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => { if (!isTyping) { handleSend(prompt); setIsSidebarOpen(false); } }}
                className="flex items-start gap-2 px-2 py-2 text-left text-[0.78rem] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-lg transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 mt-0.5 opacity-40 group-hover:opacity-100 flex-shrink-0" />
                <span className="leading-snug line-clamp-2">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-1.5 flex-wrap">
            {["Next.js", "LangChain", "Groq", "FAISS"].map((tech) => (
              <span key={tech} className="text-[0.6rem] font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 min-h-[56px]">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-slate-500 hover:text-slate-900 p-1.5 hover:bg-slate-100 rounded-lg transition-colors" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-status-dot shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              {currentSubjectLabel}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setMessages([]); setInput(""); }}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="New Chat"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <a
              href="https://github.com/ANKIT-KANDULNA/CrackMyCS-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <GithubIcon />
            </a>
          </div>
        </header>

        {/* Chat Area */}
        <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-5 md:p-8">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full text-center max-w-xl mx-auto py-10"
            >
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500 border-r-blue-400 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="w-12 h-12 m-2 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center">
                  <BrainCircuit className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">What do you want to learn?</h2>
              <p className="text-slate-500 mb-8 text-sm leading-relaxed">
                Ask anything about <strong className="text-slate-700">OS, DBMS, OOPs, CN, System Design</strong> &amp;{" "}
                <strong className="text-slate-700">Software Engineering</strong>. Answers grounded in your knowledge base.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {[
                  { icon: "📚", title: "Interview Topics", desc: "Key concepts & frequently asked questions" },
                  { icon: "🔗", title: "Learning Resources", desc: "Curated articles, videos & tutorials" },
                  { icon: "🧩", title: "DSA Connections", desc: "Related data structures & algorithms" },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 p-4 rounded-2xl text-center hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md transition-all duration-300"
                  >
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1">{feature.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5 max-w-3xl mx-auto w-full pb-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-3 max-w-[92%]",
                    msg.type === "user" ? "self-end flex-row-reverse" : "self-start"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold",
                    msg.type === "ai"
                      ? "bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/20"
                      : "bg-white border border-slate-200 text-slate-600 shadow-sm"
                  )}>
                    {msg.type === "ai" ? "AI" : "U"}
                  </div>

                  <div className={cn("flex-1 min-w-0", msg.type === "user" && "flex flex-col items-end")}>
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm leading-relaxed break-words",
                      msg.type === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm shadow-md shadow-indigo-500/15"
                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                    )}>
                      {msg.type === "ai" ? formatText(msg.content) : msg.content}
                    </div>

                    {msg.type === "ai" && msg.response && (
                      <div className="mt-2.5 flex flex-col gap-2 w-full">
                        {/* Topics */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                            <BookOpen className="w-3 h-3" /> Related Topics
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.topics.map((t, i) => (
                              <span key={i} className="text-[0.72rem] px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full font-medium">{t}</span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                            <ExternalLink className="w-3 h-3" /> Learning Resources
                          </div>
                          <ul className="flex flex-col gap-0.5">
                            {msg.response.resources.map((r, i) => (
                              <li key={i}>
                                <a href={r.url} target="_blank" rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[0.78rem] text-indigo-600 hover:text-blue-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50">
                                  <span className="opacity-30 text-xs">→</span> {r.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* DSA */}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                            <Code2 className="w-3 h-3" /> DSA Concepts
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.dsa_concepts.map((d, i) => (
                              <span key={i} className="text-[0.72rem] px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-medium">{d}</span>
                            ))}
                          </div>
                        </div>

                        {/* Sources */}
                        {msg.response.sources && msg.response.sources.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                              <Database className="w-3 h-3" /> Sources Used from Knowledge Base
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.response.sources.map((s, i) => (
                                <span key={i} className="text-[0.72rem] px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[92%] self-start">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md shadow-indigo-500/20">
                    AI
                  </div>
                  <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-dot delay-150" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-dot delay-300" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 md:p-5 border-t border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 transition-all duration-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + "px";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!isTyping) handleSend(input);
                  }
                }}
                placeholder="Ask about any CS fundamental... (Enter to send, Shift+Enter for new line)"
                className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-sm py-2 px-2 text-slate-800 placeholder:text-slate-400 leading-relaxed"
                rows={1}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 shadow-md shadow-indigo-500/20 transition-all"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <p className="text-center text-[0.65rem] text-slate-400 mt-2.5">
              Powered by <strong className="text-slate-500">LangChain + Groq + FAISS</strong> · Answers are grounded in your knowledge base
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [view, setView] = useState<"landing" | "chat">("landing");

  return (
    <AnimatePresence mode="wait">
      {view === "landing" ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <LandingPage onStart={() => setView("chat")} />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="h-screen overflow-hidden"
        >
          <ChatInterface onBack={() => setView("landing")} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
