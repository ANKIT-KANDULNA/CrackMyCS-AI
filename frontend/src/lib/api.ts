import { getSession } from "next-auth/react"
import type { MockResponse } from "@/lib/mock-data"

function getBackendUrl() {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL
  if (url) return url.replace(/\/$/, "")

  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    return "http://localhost:8000"
  }

  return ""
}

async function getAuthHeaders() {
  const session = await getSession()
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (session?.accessToken) {
    headers["Authorization"] = `Bearer ${session.accessToken}`
  }

  return headers
}

export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const backendUrl = getBackendUrl()
  if (!backendUrl) {
    throw new Error("Backend URL is not configured")
  }

  const headers = await getAuthHeaders()

  return fetch(`${backendUrl}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...((options.headers as Record<string, string>) || {}),
    },
  })
}

export interface ChatSessionSummary {
  id: number
  title: string
  subject: string
  created_at: string
  updated_at: string
  message_count: number
}

export interface ChatMessageRecord {
  id: number
  role: "user" | "assistant"
  content: string
  response_data?: MockResponse | null
  created_at: string
}

export interface ChatSessionDetail extends Omit<ChatSessionSummary, "message_count"> {
  messages: ChatMessageRecord[]
}

export async function postQuery(query: string, subject: string, sessionId?: number | null) {
  const response = await authenticatedFetch("/api/query", {
    method: "POST",
    body: JSON.stringify({
      query,
      subject,
      session_id: sessionId ?? undefined,
    }),
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required. Please sign in again.")
  }

  if (!response.ok) {
    throw new Error("Failed to get response from AI")
  }

  return response.json() as Promise<MockResponse & { session_id: number }>
}

export async function getChatSessions() {
  const response = await authenticatedFetch("/api/chats")

  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required. Please sign in again.")
  }

  if (!response.ok) {
    throw new Error("Failed to load chat history")
  }

  return response.json() as Promise<ChatSessionSummary[]>
}

export async function getChatSession(sessionId: number) {
  const response = await authenticatedFetch(`/api/chats/${sessionId}`)

  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required. Please sign in again.")
  }

  if (!response.ok) {
    throw new Error("Failed to load chat session")
  }

  return response.json() as Promise<ChatSessionDetail>
}

export async function createChatSession(subject: string, title?: string) {
  const response = await authenticatedFetch("/api/chats", {
    method: "POST",
    body: JSON.stringify({ subject, title }),
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required. Please sign in again.")
  }

  if (!response.ok) {
    throw new Error("Failed to create chat session")
  }

  return response.json() as Promise<ChatSessionSummary>
}

export async function deleteChatSession(sessionId: number) {
  const response = await authenticatedFetch(`/api/chats/${sessionId}`, {
    method: "DELETE",
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error("Authentication required. Please sign in again.")
  }

  if (!response.ok && response.status !== 204) {
    throw new Error("Failed to delete chat session")
  }
}

export async function getSubjects() {
  const response = await authenticatedFetch("/api/subjects")

  if (!response.ok) {
    throw new Error("Failed to get subjects")
  }

  return response.json()
}
