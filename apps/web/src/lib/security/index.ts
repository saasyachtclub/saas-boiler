import { checkRateLimit } from '@/lib/redis'
import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'node:crypto'

export interface SecurityConfig {
  rateLimit?: {
    requests: number
    window: number
  }
  csrf?: boolean
  cors?: boolean
}

// Rate limiting middleware
export async function rateLimit(
  request: NextRequest,
  config: SecurityConfig = {}
): Promise<NextResponse | null> {
  const { rateLimit: rateLimitConfig = { requests: 100, window: 900 } } = config

  // Get client identifier
  const identifier = getClientIdentifier(request)

  const allowed = await checkRateLimit(identifier, rateLimitConfig.requests, rateLimitConfig.window)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429 }
    )
  }

  return null
}

// CSRF protection
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function validateCSRFToken(token: string, secret: string): boolean {
  try {
    const [timestamp, hash] = token.split('.')
    const expectedHash = crypto.createHmac('sha256', secret).update(timestamp).digest('hex')

    return hash === expectedHash
  } catch {
    return false
  }
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>?/gm, '')
    .trim()
    .slice(0, 10000) // Limit length
}

// SQL injection protection (basic)
export function sanitizeSqlInput(input: string): string {
  return input.replace(/['";\\]/g, '')
}

// XSS protection
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  }
  return text.replace(/[&<>"'/]/g, (m) => map[m])
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL validation
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Get client identifier for rate limiting
export function getClientIdentifier(request: NextRequest): string {
  // Use IP address as primary identifier
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')

  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown'

  // Add user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || ''

  return `${ip}:${userAgent.slice(0, 50)}`
}

// Generate secure random string
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex')
}

// Hash sensitive data
export function hashData(data: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

// Encrypt/decrypt data
export class Encryption {
  private algorithm = 'aes-256-gcm'
  private key: Buffer
  private ivLength = 16

  constructor(secretKey: string) {
    this.key = crypto.scryptSync(secretKey, 'salt', 32)
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength)
    const cipher = crypto.createCipher(this.algorithm, this.key) as any
    cipher.setIV(iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    const authTag = cipher.getAuthTag()

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  }

  decrypt(encryptedData: string): string {
    const parts = encryptedData.split(':')
    const iv = Buffer.from(parts[0], 'hex')
    const authTag = Buffer.from(parts[1], 'hex')
    const encrypted = parts[2]

    const decipher = crypto.createDecipher(this.algorithm, this.key) as any
    decipher.setIV(iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }
}

// API key generation
export function generateApiKey(): string {
  const prefix = 'sb_' // SaaS Better prefix
  const random = crypto.randomBytes(32).toString('hex')
  return `${prefix}${random}`
}

// Validate API key format
export function validateApiKeyFormat(apiKey: string): boolean {
  const apiKeyRegex = /^sb_[a-f0-9]{64}$/
  return apiKeyRegex.test(apiKey)
}

// Security headers
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'Content-Security-Policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https:;",
}

// CORS options
export const corsOptions = {
  origin:
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || '']
      : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
}
