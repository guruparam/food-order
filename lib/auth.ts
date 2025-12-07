import { mockDb } from "./db"
import crypto from "crypto"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "manager" | "member"
  country: string
}

export interface AuthSession {
  user: User
  token: string
  expiresAt: number
}

const SESSIONS = new Map<string, AuthSession>()

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex")
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function authenticateUser(email: string, password: string): Promise<AuthSession | null> {
  const user = mockDb.users.find((u) => u.email === email && u.password === password)

  if (!user) {
    return null
  }

  const token = generateToken()
  const session: AuthSession = {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "admin" | "manager" | "member",
      country: user.country,
    },
    token,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }

  SESSIONS.set(token, session)
  return session
}

export function getSession(token: string): AuthSession | null {
  const session = SESSIONS.get(token)
  if (session && session.expiresAt > Date.now()) {
    return session
  }
  if (session) {
    SESSIONS.delete(token)
  }
  return null
}

export function logout(token: string): void {
  SESSIONS.delete(token)
}

export function canAccessCountry(user: User, country: string): boolean {
  if (user.role === "admin") {
    return true
  }
  return user.country === country
}
