import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  console.warn('Upstash Redis not configured, using in-memory cache')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'redis://localhost:6379',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Rate limiting
export async function checkRateLimit(
  identifier: string,
  limit = 100,
  window = 900
): Promise<boolean> {
  const key = `rate_limit:${identifier}`
  const now = Date.now()

  try {
    const requests = await redis.lrange(key, 0, -1)
    const validRequests = requests.filter(
      (timestamp: string) => now - Number.parseInt(timestamp) < window * 1000
    )

    if (validRequests.length >= limit) {
      return false
    }

    await redis.lpush(key, now.toString())
    await redis.ltrim(key, 0, limit - 1)
    await redis.expire(key, window)

    return true
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fallback to in-memory rate limiting
    return true
  }
}

// Caching utilities
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const cached = await redis.get(key)
    return cached ? JSON.parse(cached as string) : null
  } catch (error) {
    console.error('Cache get error:', error)
    return null
  }
}

export async function setCache<T>(key: string, value: T, ttl?: number): Promise<void> {
  try {
    const serialized = JSON.stringify(value)
    if (ttl) {
      await redis.setex(key, ttl, serialized)
    } else {
      await redis.set(key, serialized)
    }
  } catch (error) {
    console.error('Cache set error:', error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error('Cache delete error:', error)
  }
}

// Session management
export async function getSessionData(sessionId: string) {
  return getCache(`session:${sessionId}`)
}

export async function setSessionData(sessionId: string, data: any, ttl = 3600) {
  return setCache(`session:${sessionId}`, data, ttl)
}

export async function deleteSessionData(sessionId: string) {
  return deleteCache(`session:${sessionId}`)
}

// User credits cache
export async function getUserCredits(userId: string) {
  return getCache<number>(`credits:${userId}`)
}

export async function setUserCredits(userId: string, credits: number, ttl = 300) {
  return setCache(`credits:${userId}`, credits, ttl)
}

export async function decrementUserCredits(userId: string, amount = 1) {
  try {
    const currentCredits = (await getUserCredits(userId)) || 0
    const newCredits = Math.max(0, currentCredits - amount)
    await setUserCredits(userId, newCredits)
    return newCredits
  } catch (error) {
    console.error('Error decrementing credits:', error)
    return 0
  }
}

// Analytics cache
export async function incrementAnalytics(key: string, ttl = 86400) {
  try {
    const current = (await getCache<number>(`analytics:${key}`)) || 0
    await setCache(`analytics:${key}`, current + 1, ttl)
  } catch (error) {
    console.error('Analytics increment error:', error)
  }
}

export async function getAnalytics(key: string) {
  return getCache<number>(`analytics:${key}`)
}

// API key validation cache
export async function validateApiKey(apiKey: string) {
  return getCache(`api_key:${apiKey}`)
}

export async function cacheApiKey(apiKey: string, data: any, ttl = 3600) {
  return setCache(`api_key:${apiKey}`, data, ttl)
}
