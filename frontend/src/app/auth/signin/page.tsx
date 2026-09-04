"use client"

import { signIn, useSession, type SignInResponse } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, Suspense, type FormEvent } from "react"

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: "Could not start sign-in. Check your OAuth credentials.",
  OAuthCallback: "OAuth callback failed. Check redirect URIs in your OAuth app settings.",
  OAuthCreateAccount: "Could not create account.",
  Callback: "Sign-in callback failed. Is the backend running?",
  AccessDenied: "Access denied.",
  Default: "An error occurred during sign-in.",
}

function SignInContent() {
  const [loading, setLoading] = useState<string | null>(null)
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [formError, setFormError] = useState("")
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/")
    }
  }, [status, router])

  const handleSignIn = async (provider: string) => {
    setLoading(provider)
    setFormError("")
    try {
      await signIn(provider, { callbackUrl })
    } catch (err) {
      console.error("Sign in error:", err)
      setLoading(null)
    }
  }

  const handleCredentials = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError("")

    if (!email.trim() || !password) {
      setFormError("Please fill in your email and password.")
      return
    }
    if (mode === "signup" && !name.trim()) {
      setFormError("Please enter your name.")
      return
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters.")
      return
    }

    setLoading("credentials")
    let res: SignInResponse | undefined
    try {
      res = await signIn(
        "credentials",
        {
          email: email.trim(),
          password,
          name: mode === "signup" ? name.trim() : "",
          mode,
          redirect: false,
        } as any,
      )
    } catch (err) {
      console.error("Sign in error:", err)
      setFormError("Something went wrong. Please try again.")
      setLoading(null)
      return
    }

    if (res?.error) {
      setFormError(
        mode === "signup"
          ? "Sign up failed. This email may already be registered."
          : "Invalid email or password.",
      )
      setLoading(null)
      return
    }

    router.push(res?.url || callbackUrl)
  }

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to CrackMyCS AI</h1>
          <p className="text-slate-400">Sign in to access CS interview preparation</p>
        </div>

        {error && (
          <div className="mb-5 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm text-center">
            {(formError || ERROR_MESSAGES[error] || ERROR_MESSAGES.Default)}
          </div>
        )}

        {/* Email / password authentication */}
        <div className="flex mb-5 rounded-lg bg-slate-700/40 p-1 text-sm">
          <button
            onClick={() => {
              setMode("signin")
              setFormError("")
            }}
            className={`flex-1 py-2 rounded-md transition-colors font-medium ${
              mode === "signin" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode("signup")
              setFormError("")
            }}
            className={`flex-1 py-2 rounded-md transition-colors font-medium ${
              mode === "signup" ? "bg-slate-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {formError && !error && (
          <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm text-center">
            {formError}
          </div>
        )}

        <form onSubmit={handleCredentials} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full px-4 py-3 bg-slate-700/40 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
            />
          )}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full px-4 py-3 bg-slate-700/40 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className="w-full px-4 py-3 bg-slate-700/40 text-white placeholder-slate-400 rounded-lg border border-slate-600 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading !== null}
            className="w-full py-3 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "credentials" ? (
              <div className="w-5 h-5 border-2 border-blue-300 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              (mode === "signup" ? "Create Account" : "Sign In")
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-600/50" />
          <span className="text-slate-500 text-xs">or continue with Google</span>
          <div className="flex-1 h-px bg-slate-600/50" />
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handleSignIn("google")}
            disabled={loading !== null}
            className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-semibold py-3 px-4 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading === "google" ? (
              <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  )
}
