import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { db } from "@/lib/db"
import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password diperlukan")
        }

        const user = await db.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) {
          throw new Error("Akun dengan email ini tidak ditemukan")
        }

        // Verify password
        const hashed = hashPassword(credentials.password)
        if (user.passwordHash !== hashed) {
          throw new Error("Password salah")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tier: user.tier
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tier = (user as any).tier
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).tier = token.tier;
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "neville-godgard-secret-key-loas-123",
}
