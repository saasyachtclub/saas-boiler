import { createAuthClient } from 'better-auth/client'
import { auth } from './auth'

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession,
  forgotPassword,
  resetPassword,
  changePassword,
} = authClient
