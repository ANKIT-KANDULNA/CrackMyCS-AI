import NextAuth, { type DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      image?: string
    } & DefaultSession["user"]
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    image?: string
    access_token?: string
  }

  interface Account {
    access_token?: string
    backend_user_id?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    accessToken?: string
  }
}

export {}
