import { neon, neonConfig } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Configure Neon for better performance
neonConfig.fetchConnectionCache = true
neonConfig.webSocketConstructor = undefined

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required')
}

const sql = neon(process.env.DATABASE_URL)
export const db = drizzle(sql, { schema })

// Export schema types for use throughout the app
export type Database = typeof db
export * from './schema'
