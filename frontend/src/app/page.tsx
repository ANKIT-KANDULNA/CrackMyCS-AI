"use client";

import { useState, useRef, useEffect } from "react";
import { getMockResponse, type Subject, type MockResponse } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Send, Menu, X, PlusCircle, Database, Settings, Code2, Network, Server, BookOpen, BrainCircuit, ExternalLink, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  response?: MockResponse;
}

const SUBJECTS = [
  { id: 'all', label: 'All Subjects', icon: BrainCircuit },
  { id: 'os', label: 'Operating Systems', icon: Settings },
  { id: 'dbms', label: 'DBMS', icon: Database },
  { id: 'oops', label: 'OOPs', icon: Code2 },
  { id: 'cn', label: 'Computer Networks', icon: Network },
  { id: 'system_design', label: 'System Design', icon: Server },
  { id: 'se', label: 'Software Engineering', icon: BookOpen },
] as const;

const QUICK_PROMPTS = [
  "Explain process scheduling algorithms and compare them",
  "What are ACID properties in DBMS? Explain with examples",
  "Explain the four pillars of OOPs with code examples",
  "How does TCP three-way handshake work?",
  "Design a URL shortener like bit.ly from scratch",
  "What is deadlock? Explain prevention and avoidance",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentSubject, setCurrentSubject] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTo({
        top: chatAreaRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), type: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    
    // Auto reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Simulate network delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));

    const response = getMockResponse(text, currentSubject as Subject | 'all');
    
    const aiMsg: Message = { 
      id: (Date.now() + 1).toString(), 
      type: 'ai', 
      content: response.answer,
      response 
    };
    
    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const currentSubjectLabel = SUBJECTS.find(s => s.id === currentSubject)?.label || 'All Subjects';

  const formatText = (text: string) => {
    return text.split('\n').map((paragraph, idx) => {
      if (!paragraph.trim()) return null;
      
      // Basic markdown bold formatting
      const formattedParts = paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="text-gray-200">{part.slice(2, -2)}</strong>;
        }
        
        // Basic code formatting
        const codeParts = part.split(/(`.*?`)/).map((cp, j) => {
          if (cp.startsWith('`') && cp.endsWith('`')) {
            return <code key={j} className="bg-white/10 px-1.5 py-0.5 rounded text-[0.82rem] font-mono text-indigo-300">{cp.slice(1, -1)}</code>;
          }
          return cp;
        });
        
        return <span key={i}>{codeParts}</span>;
      });

      return <p key={idx} className="mb-2.5 last:mb-0">{formattedParts}</p>;
    });
  };

  return (
    <div className="flex h-screen relative z-10 text-gray-200 font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-72 bg-[#12121a]/85 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="p-5 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent leading-tight">CrackMyCS</h1>
              <span className="text-[0.65rem] font-semibold tracking-wider text-indigo-300 uppercase">AI Assistant</span>
            </div>
          </div>
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="text-[0.65rem] font-bold text-gray-500 tracking-widest mb-2 px-2">SUBJECTS</div>
          <nav className="flex flex-col gap-1 mb-8">
            {SUBJECTS.map((subject) => {
              const Icon = subject.icon;
              const isActive = currentSubject === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    setCurrentSubject(subject.id);
                    setIsSidebarOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                    isActive 
                      ? "bg-indigo-500/15 text-indigo-300" 
                      : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  )}
                >
                  {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-r-full" />}
                  <Icon className="w-4 h-4" />
                  {subject.label}
                </button>
              );
            })}
          </nav>

          <div className="text-[0.65rem] font-bold text-gray-500 tracking-widest mb-2 px-2">QUICK PROMPTS</div>
          <div className="flex flex-col gap-1.5">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setInput(prompt);
                  if (!isTyping) {
                    handleSend(prompt);
                    setIsSidebarOpen(false);
                  }
                }}
                className="flex items-start gap-2 px-2 py-2 text-left text-[0.8rem] text-gray-400 hover:text-indigo-300 hover:bg-white/5 rounded-lg transition-colors group"
              >
                <MessageSquare className="w-3.5 h-3.5 mt-0.5 opacity-50 group-hover:opacity-100 flex-shrink-0" />
                <span className="leading-snug line-clamp-2">{prompt}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <div className="flex flex-wrap gap-1.5">
            {['Next.js', 'React', 'Tailwind'].map(tech => (
              <span key={tech} className="text-[0.65rem] font-semibold px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-400">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-[#12121a]/60 backdrop-blur-md min-h-[56px]">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-status-dot" />
              {currentSubjectLabel}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setMessages([]);
                setInput("");
              }}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="New Chat"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
            <a 
              href="https://github.com/ANKIT-KANDULNA/CrackMyCS-AI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <GithubIcon />
            </a>
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={chatAreaRef}
          className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar"
        >
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-full text-center max-w-2xl mx-auto py-10"
            >
              <div className="relative w-20 h-20 flex items-center justify-center mb-6">
                <div className="absolute inset-0 border-2 border-transparent border-t-indigo-500 border-r-purple-500 rounded-full animate-[spin_4s_linear_infinite]" />
                <div className="w-14 h-14 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                  <BrainCircuit className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-3xl font-extrabold bg-gradient-to-br from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3 tracking-tight">
                Master CS Fundamentals
              </h2>
              <p className="text-gray-400 mb-10 text-[0.95rem] leading-relaxed">
                Ask anything about <strong className="text-gray-200">OS, DBMS, OOPs, CN, System Design</strong> &amp; <strong className="text-gray-200">Software Engineering</strong>.
                <br />Get interview-ready answers with curated resources &amp; DSA connections.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                {[
                  { icon: '📚', title: 'Interview Topics', desc: 'Key concepts & frequently asked questions' },
                  { icon: '🔗', title: 'Learning Resources', desc: 'Curated articles, videos & tutorials' },
                  { icon: '🧩', title: 'DSA Connections', desc: 'Related data structures & algorithms' }
                ].map((feature, i) => (
                  <div key={i} className="glass-panel p-5 rounded-xl text-center hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/5 transition-all duration-300">
                    <div className="text-2xl mb-3">{feature.icon}</div>
                    <h3 className="text-[0.85rem] font-bold text-gray-200 mb-1.5">{feature.title}</h3>
                    <p className="text-[0.75rem] text-gray-400 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full pb-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex gap-3.5 max-w-[90%]", msg.type === 'user' ? "self-end flex-row-reverse" : "self-start")}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold",
                    msg.type === 'ai' 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20" 
                      : "bg-[#1a1a2e] border border-white/10 text-gray-400"
                  )}>
                    {msg.type === 'ai' ? 'AI' : 'U'}
                  </div>
                  <div className={cn("flex-1 min-w-0", msg.type === 'user' && "flex flex-col items-end")}>
                    <div className={cn(
                      "px-4 py-3 rounded-xl text-[0.9rem] leading-relaxed break-words",
                      msg.type === 'user' 
                        ? "bg-indigo-600 text-white rounded-tr-sm" 
                        : "glass-panel text-gray-200 rounded-tl-sm"
                    )}>
                      {msg.type === 'ai' ? formatText(msg.content) : msg.content}
                    </div>

                    {msg.type === 'ai' && msg.response && (
                      <div className="mt-3.5 flex flex-col gap-3">
                        {/* Topics */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3.5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-colors">
                          <div className="flex items-center gap-2 text-[0.75rem] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
                            <BookOpen className="w-3.5 h-3.5" /> Related Topics
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.topics.map((t, i) => (
                              <span key={i} className="text-[0.75rem] px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Resources */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3.5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-colors">
                          <div className="flex items-center gap-2 text-[0.75rem] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
                            <ExternalLink className="w-3.5 h-3.5" /> Learning Resources
                          </div>
                          <ul className="flex flex-col gap-1.5">
                            {msg.response.resources.map((r, i) => (
                              <li key={i}>
                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[0.8rem] text-indigo-300 hover:text-purple-400 transition-colors py-1 px-2 rounded-md hover:bg-white/5">
                                  <span className="opacity-50">→</span> {r.title}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* DSA */}
                        <div className="bg-white/[0.02] border border-white/10 rounded-lg p-3.5 hover:bg-white/[0.04] hover:border-indigo-500/20 transition-colors">
                          <div className="flex items-center gap-2 text-[0.75rem] font-bold text-indigo-400 uppercase tracking-wider mb-2.5">
                            <Code2 className="w-3.5 h-3.5" /> DSA Concepts
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {msg.response.dsa_concepts.map((d, i) => (
                              <span key={i} className="text-[0.75rem] px-2.5 py-1 bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-full font-medium">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3.5 max-w-[90%] self-start">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
                    AI
                  </div>
                  <div className="px-4 py-3.5 glass-panel rounded-xl rounded-tl-sm flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-typing-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-typing-dot delay-150" />
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-typing-dot delay-300" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 border-t border-white/10 bg-[#12121a]/60 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto w-full relative flex items-end gap-2 bg-white/[0.03] border border-white/10 rounded-xl p-2 transition-all focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/10 focus-within:bg-white/[0.05]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (!isTyping) handleSend(input);
                }
              }}
              placeholder="Ask about any CS fundamental..."
              className="flex-1 bg-transparent border-none outline-none resize-none max-h-32 text-[0.95rem] py-2 px-2 custom-scrollbar text-gray-200 placeholder:text-gray-500 leading-relaxed"
              rows={1}
            />
            <button
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <p className="text-center text-[0.7rem] text-gray-500 mt-3">
            Powered by <strong className="text-gray-400">Next.js</strong> &nbsp;·&nbsp; Ready for Serverless Deployment
          </p>
        </div>
      </div>
    </div>
  );
}
