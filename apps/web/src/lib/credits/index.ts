import { db } from '@/lib/db'
import { creditTransactions, users } from '@/lib/db/schema'
import { getUserCredits, setUserCredits } from '@/lib/redis'
import { stripe } from '@/lib/stripe'
import { desc, eq } from 'drizzle-orm'

// Credit packages
export const CREDIT_PACKAGES = {
  starter: { credits: 1000, price: 9.99, stripePriceId: '' },
  pro: { credits: 5000, price: 39.99, stripePriceId: '' },
  enterprise: { credits: 15000, price: 99.99, stripePriceId: '' },
  custom: { credits: 0, price: 0, stripePriceId: '' },
} as const

// API endpoints and their credit costs
export const API_COSTS = {
  'GET /api/users': 1,
  'POST /api/users': 5,
  'PUT /api/users': 3,
  'DELETE /api/users': 5,
  'GET /api/organizations': 2,
  'POST /api/organizations': 10,
  'PUT /api/organizations': 5,
  'DELETE /api/organizations': 15,
  'GET /api/analytics': 5,
  'POST /api/analytics': 10,
  'GET /api/reports': 8,
  'POST /api/reports': 15,
  'GET /api/files': 3,
  'POST /api/files': 8,
  'DELETE /api/files': 5,
  'GET /api/credits': 1,
  'POST /api/credits/purchase': 0, // Free to initiate purchase
} as const

// Get user credits (with caching)
export async function getUserCreditBalance(userId: string): Promise<number> {
  // Try cache first
  const cachedCredits = await getUserCredits(userId)
  if (cachedCredits !== null) {
    return cachedCredits
  }

  // Get from database
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { credits: true },
  })

  const credits = user?.credits || 0

  // Cache for 5 minutes
  await setUserCredits(userId, credits, 300)

  return credits
}

// Deduct credits with validation
export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  apiEndpoint?: string
): Promise<{ success: boolean; remainingCredits: number; error?: string }> {
  try {
    const currentCredits = await getUserCreditBalance(userId)

    if (currentCredits < amount) {
      return {
        success: false,
        remainingCredits: currentCredits,
        error: 'Insufficient credits',
      }
    }

    const newCredits = currentCredits - amount

    // Update database
    await db.transaction(async (tx) => {
      // Update user credits
      await tx.update(users).set({ credits: newCredits }).where(eq(users.id, userId))

      // Record transaction
      await tx.insert(creditTransactions).values({
        userId,
        amount: -amount,
        type: 'usage',
        description,
        apiEndpoint,
        balanceAfter: newCredits,
      })
    })

    // Update cache
    await setUserCredits(userId, newCredits, 300)

    return {
      success: true,
      remainingCredits: newCredits,
    }
  } catch (error) {
    console.error('Error deducting credits:', error)
    return {
      success: false,
      remainingCredits: await getUserCreditBalance(userId),
      error: 'Failed to deduct credits',
    }
  }
}

// Add credits (for purchases, bonuses, etc.)
export async function addCredits(
  userId: string,
  amount: number,
  type: 'purchase' | 'bonus' | 'refund' | 'admin',
  description: string,
  stripePaymentId?: string
): Promise<{ success: boolean; newBalance: number }> {
  try {
    const currentCredits = await getUserCreditBalance(userId)
    const newCredits = currentCredits + amount

    // Update database
    await db.transaction(async (tx) => {
      // Update user credits
      await tx.update(users).set({ credits: newCredits }).where(eq(users.id, userId))

      // Record transaction
      await tx.insert(creditTransactions).values({
        userId,
        amount,
        type,
        description,
        stripePaymentId,
        balanceAfter: newCredits,
      })
    })

    // Update cache
    await setUserCredits(userId, newCredits, 300)

    return {
      success: true,
      newBalance: newCredits,
    }
  } catch (error) {
    console.error('Error adding credits:', error)
    return {
      success: false,
      newBalance: 0,
    }
  }
}

// Get credit transaction history
export async function getCreditHistory(userId: string, limit = 50, offset = 0) {
  return await db.query.creditTransactions.findMany({
    where: eq(creditTransactions.userId, userId),
    orderBy: desc(creditTransactions.createdAt),
    limit,
    offset,
  })
}

// Calculate API cost
export function getApiCost(method: string, endpoint: string): number {
  const key = `${method} ${endpoint}` as keyof typeof API_COSTS
  return API_COSTS[key] || 1 // Default cost
}

// Purchase credits via Stripe
export async function purchaseCredits(
  userId: string,
  packageType: keyof typeof CREDIT_PACKAGES,
  successUrl: string,
  cancelUrl: string
) {
  const creditPackage = CREDIT_PACKAGES[packageType]

  if (!creditPackage.stripePriceId) {
    throw new Error('Credit package not configured for purchase')
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: creditPackage.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      userId,
      packageType,
      credits: creditPackage.credits.toString(),
    },
  })

  return session
}

// Get usage statistics
export async function getUsageStats(userId: string, days = 30) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const transactions = await db.query.creditTransactions.findMany({
    where: eq(creditTransactions.userId, userId),
    orderBy: desc(creditTransactions.createdAt),
  })

  const usageTransactions = transactions.filter((t) => t.type === 'usage')

  const totalUsed = usageTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const apiCalls = usageTransactions.length

  const endpointUsage = usageTransactions.reduce(
    (acc, transaction) => {
      const endpoint = transaction.apiEndpoint || 'unknown'
      acc[endpoint] = (acc[endpoint] || 0) + Math.abs(transaction.amount)
      return acc
    },
    {} as Record<string, number>
  )

  return {
    totalUsed,
    apiCalls,
    endpointUsage,
    periodDays: days,
  }
}

// Check if user has sufficient credits for API call
export async function hasSufficientCredits(
  userId: string,
  method: string,
  endpoint: string
): Promise<boolean> {
  const cost = getApiCost(method, endpoint)
  const balance = await getUserCreditBalance(userId)
  return balance >= cost
}
