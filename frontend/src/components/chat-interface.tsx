"use client";

import Link from "next/link";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { getMockResponse, type MockResponse } from "@/lib/mock-data";
import {
  BACKEND_SUBJECTS,
  SUBJECTS,
  QUICK_PROMPTS,
  SUBJECT_QUICK_PROMPTS,
  type ChatSubjectId,
  type SubjectId,
} from "@/lib/subjects";
import { cn } from "@/lib/utils";
import {
  Send,
  Menu,
  X,
  PlusCircle,
  Database,
  Code2,
  BookOpen,
  BrainCircuit,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  Video,
  HelpCircle,
  Copy,
  RefreshCw,
  ArrowLeft,
  Home,
  Settings,
  ZoomIn,
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
  timestamp?: Date;
}

interface ChatInterfaceProps {
  subjectId: ChatSubjectId;
  locked?: boolean;
}

export function ChatInterface({ subjectId, locked = false }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K for new chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setMessages([]);
        setInput("");
        if (inputRef.current) inputRef.current.focus();
      }
      // Escape to clear input
      if (e.key === 'Escape' && inputRef.current === document.activeElement) {
        setInput("");
        if (inputRef.current) inputRef.current.style.height = "auto";
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const quickPrompts =
    locked && subjectId !== "all"
      ? SUBJECT_QUICK_PROMPTS[subjectId as SubjectId] ?? QUICK_PROMPTS
      : QUICK_PROMPTS;

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: createMessageId(), type: "user", content: text, timestamp: new Date() };
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
        body: JSON.stringify({
          query: text,
          subject: BACKEND_SUBJECTS[subjectId] || "System Design",
        }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setMessages((prev) => [...prev, { id: createMessageId(), type: "ai", content: data.answer, response: data, timestamp: new Date() }]);
    } catch {
      const fallback = getMockResponse(text, subjectId);
      setMessages((prev) => [...prev, { id: createMessageId(), type: "ai", content: fallback.answer, response: fallback, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex(m => m.id === messageId);
    if (messageIndex === -1) return;
    
    const userMessage = messages[messageIndex - 1];
    if (!userMessage || userMessage.type !== "user") return;

    // Remove the AI response
    setMessages(prev => prev.filter(m => m.id !== messageId));
    
    // Regenerate
    await handleSend(userMessage.content);
  };

  const currentSubject = SUBJECTS.find((s) => s.id === subjectId);
  const currentSubjectLabel = currentSubject?.label || "All Subjects";

  const formatText = (text: string) => {
    const lines = text.split("\n");
    const formattedContent: ReactNode[] = [];
    let currentList: string[] = [];
    let inList = false;
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];
    let currentSection: string[] = [];
    let inCodeBlock = false;
    let codeBlockLines: string[] = [];

    const flushList = () => {
      if (currentList.length > 0) {
        formattedContent.push(
          <ul key={`list-${formattedContent.length}`} className="list-disc list-inside mb-4 space-y-1 ml-4">
            {currentList.map((item, i) => (
              <li key={i} className="text-slate-700 leading-relaxed">{formatInlineText(item)}</li>
            ))}
          </ul>
        );
        currentList = [];
        inList = false;
      }
    };

    const flushTable = () => {
      if (tableRows.length > 0) {
        formattedContent.push(
          <div key={`table-${formattedContent.length}`} className="mb-4 overflow-x-auto">
            <table className="min-w-full border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-blue-50">
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-blue-900 border-b border-blue-200">
                      {formatInlineText(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {tableRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b border-slate-100">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm text-slate-700">
                        {formatInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableHeaders = [];
        tableRows = [];
        inTable = false;
      }
    };

    const flushSection = (heading?: string) => {
      if (currentSection.length > 0) {
        const sectionText = currentSection.join('\n');
        if (heading) {
          formattedContent.push(
            <h3 key={`section-${formattedContent.length}`} className="text-lg font-bold text-blue-900 mt-6 mb-3">
              {formatInlineText(heading)}
            </h3>
          );
        }
        formattedContent.push(
          <p key={`para-${formattedContent.length}`} className="mb-3 text-slate-700 leading-relaxed whitespace-pre-line">
            {formatInlineText(sectionText)}
          </p>
        );
        currentSection = [];
      }
    };

    const flushCodeBlock = () => {
      if (codeBlockLines.length > 0) {
        formattedContent.push(
          <div key={`code-${formattedContent.length}`} className="mb-4 overflow-x-auto">
            <div className="bg-slate-900 rounded-lg p-4">
              <pre className="text-sm text-slate-100 font-mono overflow-x-auto">
                <code>{codeBlockLines.join('\n')}</code>
              </pre>
            </div>
          </div>
        );
        codeBlockLines = [];
        inCodeBlock = false;
      }
    };

    const formatInlineText = (text: string) => {
      // Highlight key terms
      const keyTerms = ['Encapsulation', 'Abstraction', 'Inheritance', 'Polymorphism', 
                       'Atomicity', 'Consistency', 'Isolation', 'Durability',
                       'process', 'thread', 'deadlock', 'scheduling', 'FCFS', 'SJF'];
      
      let processedText = text;
      keyTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        processedText = processedText.replace(regex, `**${term}**`);
      });

      const parts = processedText.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**"))
          return (
            <strong key={i} className="text-blue-900 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        const codeParts = part.split(/(`.*?`)/).map((cp, j) => {
          if (cp.startsWith("`") && cp.endsWith("`"))
            return (
              <code key={j} className="bg-blue-50 px-1.5 py-0.5 rounded-md text-[0.8rem] font-mono text-blue-800">
                {cp.slice(1, -1)}
              </code>
            );
          return cp;
        });
        return <span key={i}>{codeParts}</span>;
      });
      return <>{parts}</>;
    };

    // Enhanced markdown-like parser
    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      
      // Handle code blocks
      if (trimmedLine.startsWith("```")) {
        flushList();
        flushTable();
        flushSection();
        
        if (!inCodeBlock) {
          // Start code block
          inCodeBlock = true;
        } else {
          // End code block
          flushCodeBlock();
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockLines.push(line);
        return;
      }

      // Skip empty lines
      if (!trimmedLine) {
        flushList();
        flushTable();
        flushSection();
        return;
      }

      // Detect headings (## or ###)
      if (trimmedLine.startsWith("##")) {
        flushList();
        flushTable();
        flushSection();
        const headingText = trimmedLine.replace(/^#{2,3}\s*/, '').trim();
        formattedContent.push(
          <h3 key={`heading-${idx}`} className="text-lg font-bold text-blue-900 mt-6 mb-3">
            {formatInlineText(headingText)}
          </h3>
        );
        return;
      }

      // Detect heading pattern "**Text:**" or "**Text**:"
      if (/^\*\*[^*]+\*\*:/.test(trimmedLine) || /^\*\*[^*]+\*\*$/.test(trimmedLine)) {
        flushList();
        flushTable();
        flushSection();
        const headingText = trimmedLine.replace(/^\*\*([^*]+)\*\*[:\s]*/, '$1').trim();
        formattedContent.push(
          <h3 key={`heading-${idx}`} className="text-lg font-bold text-blue-900 mt-6 mb-3">
            {formatInlineText(headingText)}
          </h3>
        );
        return;
      }

      // Detect numbered list items (1. or 1))
      if (/^\d+[\.\)]\s/.test(trimmedLine)) {
        flushSection();
        flushTable();
        if (!inList) {
          inList = true;
        }
        currentList.push(trimmedLine.replace(/^\d+[\.\)]\s*/, ''));
        return;
      }

      // Detect table patterns (lines with | separators)
      if (trimmedLine.includes("|")) {
        flushList();
        flushSection();
        if (!inTable) {
          inTable = true;
        }
        
        const cells = trimmedLine.split("|").map((cell: string) => cell.trim()).filter((cell: string) => cell);
        
        // First line with | is typically header
        if (tableHeaders.length === 0) {
          tableHeaders = cells;
        } else if (!trimmedLine.includes("---")) {
          // Skip separator lines (like |---|---|)
          tableRows.push(cells);
        }
        return;
      }

      // If we were in a table but this line isn't, flush the table
      if (inTable) {
        flushTable();
      }

      // Detect list items (starts with - or *)
      if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
        flushSection();
        if (!inList) {
          inList = true;
        }
        currentList.push(trimmedLine.replace(/^[-*]\s*/, ''));
        return;
      }

      // If we were in a list but this line isn't, flush the list
      if (inList) {
        flushList();
      }

      // Regular paragraph - accumulate for section detection
      currentSection.push(trimmedLine);
    });

    // Flush any remaining content
    flushList();
    flushTable();
    flushSection();
    flushCodeBlock();

    return <>{formattedContent}</>;
  };

  const emptyStateDescription =
    locked && subjectId !== "all"
      ? `Ask anything about ${currentSubjectLabel}. Answers are grounded in your ${currentSubjectLabel} knowledge base only.`
      : "Ask anything about OS, DBMS, OOPs, CN, System Design & Software Engineering. Answers grounded in your knowledge base.";

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-xl md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/30">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 leading-tight">CrackMyCS</div>
              <div className="text-[0.58rem] font-bold tracking-wider text-blue-800 uppercase">AI Assistant</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all text-xs font-semibold border border-transparent hover:border-slate-200"
              title="Back to Home"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <button
              className="md:hidden p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-[0.6rem] font-bold text-slate-400 tracking-[0.12em] uppercase mb-2 px-2 mt-1">
            {locked ? "Other Subjects" : "Subjects"}
          </p>
          <nav className="flex flex-col gap-0.5 mb-5">
            {SUBJECTS.filter((s) => !locked || s.id !== subjectId).map(({ id, label, icon: Icon, desc, route }) => {
              const isActive = subjectId === id;
              const href = route ?? "/chat";

              return (
                <Link
                  key={id}
                  href={href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative text-left w-full",
                    isActive
                      ? "bg-blue-50 text-blue-900 border border-blue-200"
                      : "text-slate-600 hover:bg-blue-50 hover:text-blue-900 border border-transparent"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1/2 bg-gradient-to-b from-blue-900 to-blue-600 rounded-r-full" />
                  )}
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="truncate">{label}</div>
                    <div className="text-[0.62rem] text-slate-400 font-normal truncate">{desc}</div>
                  </div>
                </Link>
              );
            })}
          </nav>

          <p className="text-[0.6rem] font-bold text-slate-400 tracking-[0.12em] uppercase mb-2 px-2">Quick Prompts</p>
          <div className="flex flex-col gap-0.5">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  if (!isTyping) {
                    handleSend(prompt);
                    setIsSidebarOpen(false);
                  }
                }}
                className="flex items-start gap-2 px-2 py-2 text-left text-[0.78rem] text-slate-500 hover:text-blue-900 hover:bg-blue-50/60 rounded-lg transition-colors group"
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
              <span key={tech} className="text-[0.6rem] font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200 min-h-[56px]">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-slate-500 hover:text-blue-900 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-status-dot shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
              {currentSubjectLabel}
              {locked && subjectId !== "all" && (
                <span className="text-[0.65rem] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Subject only
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
              className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              title="New Chat"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <Link
              href="/"
              className="hidden sm:flex p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              title="Back to Home"
            >
              <Home className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/ANKIT-KANDULNA/CrackMyCS-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <GithubIcon />
            </a>
          </div>
        </header>

        <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-5 md:p-8">
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full text-center max-w-xl mx-auto py-10"
            >
              <div className="relative w-20 h-20 mb-8">
                <div className="absolute inset-0 border-2 border-transparent border-t-slate-400 border-r-slate-300 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="absolute inset-2 border-2 border-transparent border-b-slate-400 border-l-slate-300 rounded-full animate-[spin_3s_linear_infinite_reverse]" />
                <div className="w-14 h-14 m-3 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-full flex items-center justify-center shadow-lg">
                  <BrainCircuit className="w-7 h-7 text-blue-900" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                What do you want to learn?
              </h2>
              <p className="text-slate-500 mb-10 text-sm leading-relaxed max-w-md">{emptyStateDescription}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
                {[
                  { icon: "📚", title: "Interview Topics", desc: "Key concepts & frequently asked questions", color: "from-amber-50 to-yellow-50", border: "border-amber-200" },
                  { icon: "🔗", title: "Learning Resources", desc: "Curated articles, videos & tutorials", color: "from-emerald-50 to-green-50", border: "border-emerald-200" },
                  { icon: "🧩", title: "DSA Connections", desc: "Related data structures & algorithms", color: "from-slate-50 to-slate-100", border: "border-slate-200" },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05, y: -4 }}
                    className={`bg-gradient-to-br ${feature.color} border ${feature.border} p-5 rounded-2xl text-center cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md`}
                  >
                    <div className="text-3xl mb-3">{feature.icon}</div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {quickPrompts.slice(0, 3).map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    disabled={isTyping}
                    className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-xs rounded-full hover:border-slate-300 hover:text-blue-900 hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Try: "{prompt.slice(0, 25)}{prompt.length > 25 ? '...' : ''}"
                  </button>
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
                  className={cn("flex gap-3 max-w-[92%]", msg.type === "user" ? "self-end flex-row-reverse" : "self-start")}
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold",
                      msg.type === "ai"
                        ? "bg-gradient-to-br from-blue-900 to-blue-700 text-white shadow-md shadow-blue-900/30"
                        : "bg-white border border-slate-200 text-slate-600 shadow-sm"
                    )}
                  >
                    {msg.type === "ai" ? "AI" : "U"}
                  </div>

                  <div className={cn("flex-1 min-w-0", msg.type === "user" && "flex flex-col items-end")}>
                    <div className="flex items-start gap-2">
                      <div
                        className={cn(
                          "px-4 py-3 rounded-2xl text-sm leading-relaxed break-words",
                          msg.type === "user"
                            ? "bg-blue-900 text-white rounded-tr-sm shadow-md shadow-blue-900/20"
                            : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
                        )}
                      >
                        {msg.type === "ai" ? formatText(msg.content) : msg.content}
                      </div>
                      
                      {msg.type === "ai" && (
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleCopy(msg.content)}
                            className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors hidden sm:block"
                            title="Copy response"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleRegenerate(msg.id)}
                            disabled={isTyping}
                            className="p-1.5 text-slate-400 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hidden sm:block"
                            title="Regenerate response"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {msg.type === "ai" && msg.response && (
                      <div className="mt-2.5 flex flex-col gap-2 w-full">
                        {msg.response.summary && (
                          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-amber-700 uppercase tracking-wider mb-2">
                              <HelpCircle className="w-3 h-3" /> Quick Summary
                            </div>
                            <div className="text-[0.78rem] text-slate-700 leading-relaxed whitespace-pre-line">
                              {msg.response.summary}
                            </div>
                          </div>
                        )}

                        {msg.response.images && msg.response.images.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate-600 uppercase tracking-wider mb-2">
                              <ImageIcon className="w-3 h-3" /> Related Images
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {msg.response.images.map((img, i) => (
                                <button
                                  key={i}
                                  onClick={() => setPreviewImage({ url: img.image_url, title: img.title })}
                                  className="group relative block rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-colors"
                                >
                                  <img
                                    src={img.image_url}
                                    alt={img.title}
                                    className="w-full h-20 sm:h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="absolute top-2 right-2">
                                      <ZoomIn className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="absolute bottom-1 left-1 right-1">
                                      <p className="text-[0.6rem] sm:text-[0.65rem] text-white font-medium line-clamp-2">{img.title}</p>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.response.video_links && msg.response.video_links.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-red-600 uppercase tracking-wider mb-2">
                              <Video className="w-3 h-3" /> Video Resources
                            </div>
                            <div className="flex flex-col gap-1.5">
                              {msg.response.video_links.map((video, i) => (
                                <a
                                  key={i}
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-[0.78rem] text-red-600 hover:text-red-700 transition-colors py-1 px-2 rounded-lg hover:bg-red-50 group"
                                >
                                  <div className="w-5 h-5 rounded bg-red-100 flex items-center justify-center flex-shrink-0">
                                    <Video className="w-3 h-3 text-red-600" />
                                  </div>
                                  <span className="line-clamp-1 group-hover:underline">{video.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {msg.response.interview_questions && msg.response.interview_questions.length > 0 && (
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate-900 uppercase tracking-wider mb-2">
                              <HelpCircle className="w-3 h-3" /> Practice Interview Questions
                            </div>
                            <ul className="flex flex-col gap-1">
                              {msg.response.interview_questions.map((q, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-[0.7rem] font-bold text-slate-700 mt-0.5">{i + 1}.</span>
                                  <span className="text-[0.78rem] text-slate-700 leading-snug">{q}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate-900 uppercase tracking-wider mb-2">
                            <BookOpen className="w-3 h-3" /> Related Topics
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.topics.map((t, i) => (
                              <span
                                key={i}
                                className="text-[0.72rem] px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {msg.response.resources?.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate-900 uppercase tracking-wider mb-2">
                              <ExternalLink className="w-3 h-3" /> Top Articles
                            </div>
                            <ul className="flex flex-col gap-0.5">
                              {msg.response.resources.slice(0, 3).map((r, i) => (
                                <li key={i}>
                                  <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-[0.78rem] text-slate-600 hover:text-slate-900 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
                                  >
                                    <span className="opacity-30 text-xs">→</span> {r.title}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                          <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-slate-900 uppercase tracking-wider mb-2">
                            <Code2 className="w-3 h-3" /> DSA Concepts
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.dsa_concepts.map((d, i) => (
                              <span
                                key={i}
                                className="text-[0.72rem] px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-medium"
                              >
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>

                        {msg.response.sources && msg.response.sources.length > 0 && (
                          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                            <div className="flex items-center gap-1.5 text-[0.68rem] font-bold text-emerald-600 uppercase tracking-wider mb-2">
                              <Database className="w-3 h-3" /> Sources Used from Knowledge Base
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.response.sources.map((s, i) => (
                                <span
                                  key={i}
                                  className="text-[0.72rem] px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full font-medium flex items-center gap-1"
                                >
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
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-md shadow-slate-900/20">
                    AI
                  </div>
                  <div className="px-4 py-3 bg-white border border-slate-200 rounded-2xl rounded-tl-sm shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-800 animate-typing-dot" />
                        <div className="w-2 h-2 rounded-full bg-blue-700 animate-typing-dot delay-150" />
                        <div className="w-2 h-2 rounded-full bg-blue-900 animate-typing-dot delay-300" />
                      </div>
                      <span className="text-xs text-slate-400 font-medium">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 md:p-5 border-t border-slate-200 bg-white">
          <div className="max-w-3xl mx-auto w-full">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 transition-all duration-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white">
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
                placeholder={
                  locked && subjectId !== "all"
                    ? `Ask about ${currentSubjectLabel}... (Press Enter to send)`
                    : "Ask about any CS fundamental... (Press Enter to send, Shift+Enter for new line)"
                }
                className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-sm py-2 px-2 text-slate-800 placeholder:text-slate-400 leading-relaxed"
                rows={1}
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 shadow-md shadow-blue-900/30 transition-all"
              >
                <Send className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>
            <p className="text-center text-[0.65rem] text-slate-400 mt-2.5">
              Powered by <strong className="text-slate-500">LangChain + Groq + FAISS</strong> · 
              <span className="hidden sm:inline">Answers are grounded in your knowledge base · </span>
              <span className="hidden xs:inline">
                <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[0.6rem] font-mono">Ctrl+K</kbd> New Chat · 
                <kbd className="px-1 py-0.5 bg-slate-100 rounded text-[0.6rem] font-mono">Esc</kbd> Clear
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setPreviewImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm font-medium">{previewImage.title}</p>
                  <a
                    href={previewImage.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Open Original
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
