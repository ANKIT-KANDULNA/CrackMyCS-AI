"use client";

import Link from "next/link";
import {
  BrainCircuit,
  Database,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Zap,
  Layers,
  Sparkles,
  Check,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import { CHAT_SUBJECTS } from "@/lib/subjects";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center shadow-md shadow-blue-900/30">
            <BrainCircuit className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">CrackMyCS</span>
          <span className="text-[0.58rem] font-bold tracking-wider text-blue-900 uppercase bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            AI
          </span>
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
          <Link
            href="/chat"
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-900 to-blue-700 text-white text-sm font-semibold rounded-xl hover:from-blue-800 hover:to-blue-600 transition-all duration-200"
          >
            Open App
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(30,58,138,0.12),transparent)] pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent" />

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200/70 rounded-full text-sm font-medium text-blue-900 mb-8 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            RAG-Powered · LangChain + Groq + FAISS
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="text-5xl md:text-[4.5rem] font-black text-slate-900 leading-[1.05] tracking-[-0.03em] mb-6"
          >
            Crack every{" "}
            <span className="bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
              CS Interview
            </span>
            <br />
            with your knowledge base.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Ask anything about OS, DBMS, OOPs, Computer Networks, System Design &amp; Software Engineering. Get
            structured, interview-ready answers — grounded in your own curated study material.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.24 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/chat"
              className="group flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-blue-900 to-blue-700 text-white font-semibold rounded-2xl hover:from-blue-800 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-[1.02] transition-all duration-200 text-[0.95rem]"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-900 transition-all duration-200 text-[0.95rem]"
            >
              See features
            </a>
          </motion.div>

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

        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="relative max-w-3xl mx-auto mt-20"
        >
          <div className="absolute -inset-4 bg-gradient-to-b from-blue-200/50 via-blue-100/30 to-transparent blur-3xl rounded-3xl pointer-events-none" />
          <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-blue-200/50 overflow-hidden">
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
            <div className="p-6 bg-slate-50/60 space-y-4 min-h-[200px]">
              <div className="flex justify-end">
                <div className="bg-blue-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-xs shadow-sm">
                  What are ACID properties in DBMS?
                </div>
              </div>
              <div className="flex gap-3 max-w-2xl">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  AI
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-700 shadow-sm leading-relaxed">
                  <p className="mb-3">
                    <strong className="text-slate-900">ACID properties</strong> are the cornerstone of reliable
                    database transactions — Atomicity, Consistency, Isolation, and Durability...
                  </p>
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {["Transactions", "MVCC", "WAL", "Isolation Levels"].map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-full font-medium"
                      >
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

      <section id="features" className="py-24 px-6 bg-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-[0.15em]">Features</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">Everything you need to prepare</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">Built for serious CS interview prep. Not just another chatbot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6 text-blue-900" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">RAG-Powered Intelligence</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-sm">
                Your questions are answered using your own curated knowledge base — not generic AI training data. The AI
                retrieves the most relevant documents first, then generates a grounded, accurate answer.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { num: "01", label: "Retrieve", icon: Database },
                  { num: "02", label: "Augment", icon: Layers },
                  { num: "03", label: "Generate", icon: Sparkles },
                ].map(({ num, label, icon: Icon }) => (
                  <div
                    key={num}
                    className="flex flex-col items-center p-3 bg-blue-50 rounded-2xl border border-blue-200/80"
                  >
                    <span className="text-xl font-black text-blue-400 mb-0.5">{num}</span>
                    <Icon className="w-4 h-4 text-blue-900 mb-1" />
                    <span className="text-xs font-semibold text-blue-900">{label}</span>
                  </div>
                ))}
              </div>
            </div>

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
                  <span
                    key={f}
                    className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl font-medium flex items-center gap-1.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" /> {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Blazing Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Powered by Groq&apos;s ultra-fast LLM inference. Complete, structured answers arrive in seconds, not minutes.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">6 Core CS Subjects</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                Each subject has its own dedicated chat route for focused doubt-solving.
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {CHAT_SUBJECTS.map(({ id, label, route }) => (
                  <Link
                    key={id}
                    href={route!}
                    className="text-xs px-2 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-semibold text-center border border-blue-100 hover:bg-blue-100 transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:col-span-1 bg-gradient-to-br from-blue-900 to-blue-950 rounded-3xl p-7 shadow-md hover:shadow-xl hover:shadow-blue-900/40 hover:-translate-y-0.5 transition-all duration-300 group text-white">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interview-Ready Format</h3>
              <p className="text-white/75 text-sm leading-relaxed">
                Structured answers with related topics, curated resources, and DSA connections — exactly what interviewers
                want to hear.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="subjects" className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-[0.15em]">Subjects</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">Pick a subject to start</h2>
            <p className="text-slate-500 text-lg max-w-lg mx-auto">
              Or use <Link href="/chat" className="text-blue-900 font-semibold hover:underline">/chat</Link> to ask
              across all subjects.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHAT_SUBJECTS.map(({ id, label, icon: Icon, desc, route }) => (
              <Link
                key={id}
                href={route!}
                className="group flex items-start gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-300 hover:bg-blue-50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-300 group-hover:scale-105 transition-all">
                  <Icon className="w-5 h-5 text-blue-900" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-900 transition-colors">{label}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-24 px-6 bg-slate-50/70">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-[0.15em]">How It Works</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 mb-4 tracking-tight">From question to answer in seconds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200" />

            {[
              {
                icon: MessageSquare,
                title: "Ask Your Question",
                desc: "Type any CS interview question. On subject routes, answers stay scoped to that topic only.",
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
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto mb-5">
                      <Icon className="w-8 h-8 text-blue-900" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-900 text-white text-[0.6rem] font-black flex items-center justify-center shadow-md shadow-blue-900/30">
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

      <section className="py-24 px-6 bg-gradient-to-br from-blue-900 via-blue-950 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-line-grid opacity-20 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-[1.1] tracking-tight">
              Ready to ace your
              <br />
              CS interview?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-md mx-auto">
              Start asking questions right now — no account, no setup, no friction.
            </p>
            <Link
              href="/chat"
              className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-blue-900 font-bold rounded-2xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 text-base"
            >
              Start Chatting Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center shadow-sm">
              <BrainCircuit className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-sm">CrackMyCS AI</span>
          </div>
          <p className="text-slate-400 text-xs">
            Built with Next.js · LangChain · Groq · FAISS · HuggingFace Embeddings
          </p>
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
