"use client"

import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

export function AuthHeader() {
  const { data: session, status } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
      </div>
    )
  }

  if (!session) {
    return (
      <button
        onClick={() => (window.location.href = "/auth/signin")}
        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm"
      >
        Sign In
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full border border-slate-200"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white font-medium text-sm">
            {session.user.name?.[0] || "U"}
          </div>
        )}
        <span className="text-slate-700 font-medium hidden sm:block text-sm">
          {session.user.name}
        </span>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 z-20">
            <div className="p-3 border-b border-slate-100">
              <p className="text-slate-900 font-medium text-sm">{session.user.name}</p>
              <p className="text-slate-500 text-xs">{session.user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors rounded-b-lg text-sm"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
