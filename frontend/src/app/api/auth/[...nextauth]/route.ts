import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

// Kept in sync with the backend default so OAuth sync works out-of-the-box locally.
// Change both in production and keep them identical.
const DEV_AUTH_SECRET = "dev-auth-secret-change-in-production"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET || DEV_AUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "email-password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        mode: { label: "Mode", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const { email, password } = credentials
        const name = credentials.name?.toString?.() || ""
        const mode = credentials.mode?.toString?.() || "signin"
        const isSignup = mode === "signup"

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
        const endpoint = isSignup ? "/api/auth/register" : "/api/auth/login"

        try {
          const response = await fetch(`${backendUrl}${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
              isSignup
                ? { email, password, name: name || email.split("@")[0] }
                : { email, password }
            ),
          })

          if (!response.ok) {
            let detail: string | null = null
            try {
              detail = (await response.json()).detail
            } catch {
              detail = null
            }
            throw new Error(detail || (isSignup ? "Registration failed" : "Invalid credentials"))
          }

          const data = await response.json()
          // `access_token` is the JWT issued by the backend. It's surfaced to the
          // jwt -> session callbacks below and used for all authenticated requests.
          return {
            id: String(data.user.id),
            email: data.user.email,
            name: data.user.name,
            image: data.user.image_url,
            access_token: data.access_token,
          }
        } catch (error) {
          console.error("Credentials auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Credentials users are created/updated directly by the backend on
      // login/register, so there is nothing extra to sync here.
      if (account?.provider === "credentials" || account?.provider === "email-password") {
        return true
      }

      if (!account || !user?.email) return false

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
      const authSecret = process.env.AUTH_CALLBACK_SECRET || DEV_AUTH_SECRET

      try {
        const response = await fetch(`${backendUrl}/api/auth/callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Auth-Secret": authSecret,
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name,
            provider: account.provider,
            provider_id: account.providerAccountId || user.email,
            image_url: user.image,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          if (response.status === 403) {
            console.error(
              "Auth callback secret mismatch — check that AUTH_CALLBACK_SECRET matches on both frontend and backend (.env / .env.local). Backend responded 403:",
              errorText,
            )
          } else {
            console.error("Backend auth sync failed:", response.status, errorText)
          }
          return false
        }

        const data = await response.json()
        account.access_token = data.access_token
        account.backend_user_id = String(data.user.id)
        return true
      } catch (error) {
        console.error("Error syncing with backend:", error)
        return false
      }
    },
    async jwt({ token, user, account }) {
      if (account) {
        // Credentials (email/password) users: the access token comes from authorize().
        if (
          (account.provider === "credentials" || account.provider === "email-password") &&
          user
        ) {
          if (user.id) token.id = user.id
          if (user.access_token) token.accessToken = user.access_token
        } else {
          // OAuth (Google): the access token comes from the backend sync callback.
          if (account.access_token) token.accessToken = account.access_token
          if (account.backend_user_id) token.id = account.backend_user_id
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string
        if (token.accessToken) session.accessToken = token.accessToken as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
