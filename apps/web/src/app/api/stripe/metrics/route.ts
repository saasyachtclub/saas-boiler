import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products, subscriptions } from '@/lib/db/schema'
import { captureError, withAxiom } from '@/lib/logging'
import { count, desc, eq, sum } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'

export const GET = withAxiom(async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user || ((session.user as any).role !== 'admin' && (session.user as any).role !== 'super_admin')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Get subscription metrics
    const subscriptionMetrics = await db
      .select({
        totalRevenue: sum(products.price),
        activeSubscriptions: count(subscriptions.id),
        totalSubscriptions: count(),
      })
      .from(subscriptions)
      .leftJoin(products, eq(subscriptions.productId, products.id))
      .where(eq(subscriptions.status, 'active'))

    // Get monthly revenue (simplified - in production you'd calculate this properly)
    const monthlyRevenue = await db
      .select({
        revenue: sum(products.price),
      })
      .from(subscriptions)
      .leftJoin(products, eq(subscriptions.productId, products.id))
      .where(eq(subscriptions.status, 'active'))
    // In production, add date filtering for current month

    // Get top performing plans
    const topPlans = await db
      .select({
        name: products.name,
        revenue: sum(products.price),
        subscribers: count(subscriptions.id),
      })
      .from(subscriptions)
      .leftJoin(products, eq(subscriptions.productId, products.id))
      .where(eq(subscriptions.status, 'active'))
      .groupBy(products.id, products.name)
      .orderBy(desc(sum(products.price)))
      .limit(5)

    // Calculate percentages for top plans
    const totalRevenue = Number(subscriptionMetrics[0]?.totalRevenue) || 0
    const topPlansWithPercentages = topPlans.map((plan) => ({
      ...plan,
      revenue: Number(plan.revenue) || 0,
      subscribers: Number(plan.subscribers) || 0,
      percentage: totalRevenue > 0 ? Math.round((Number(plan.revenue) / Number(totalRevenue)) * 100) : 0,
    }))

    // Get recent payments (mock data - in production integrate with Stripe)
    const recentPayments = [
      {
        id: 'pi_123',
        customer: 'John Doe',
        amount: 29.99,
        status: 'succeeded' as const,
        date: '2024-01-15',
        plan: 'Pro Plan',
      },
      {
        id: 'pi_124',
        customer: 'Jane Smith',
        amount: 49.99,
        status: 'succeeded' as const,
        date: '2024-01-14',
        plan: 'Enterprise Plan',
      },
      {
        id: 'pi_125',
        customer: 'Bob Johnson',
        amount: 19.99,
        status: 'failed' as const,
        date: '2024-01-13',
        plan: 'Basic Plan',
      },
    ]

    // Mock revenue growth data
    const revenueGrowth = [
      { month: 'Dec 2023', revenue: 85000, growth: 15 },
      { month: 'Jan 2024', revenue: 92000, growth: 8 },
      { month: 'Feb 2024', revenue: 98000, growth: 7 },
      { month: 'Mar 2024', revenue: 105000, growth: 7 },
      { month: 'Apr 2024', revenue: 112000, growth: 7 },
      { month: 'May 2024', revenue: 118000, growth: 5 },
    ]

    const metrics = {
      totalRevenue: Number(subscriptionMetrics[0]?.totalRevenue) || 0,
      monthlyRevenue: Number(monthlyRevenue[0]?.revenue) || 118000,
      activeSubscriptions: Number(subscriptionMetrics[0]?.activeSubscriptions) || 0,
      churnRate: 3.2, // Mock data - calculate from actual subscription data
      averageRevenuePerUser: subscriptionMetrics[0]?.activeSubscriptions
        ? Math.round(
          (Number(subscriptionMetrics[0]?.totalRevenue) || 0) /
          Number(subscriptionMetrics[0]?.activeSubscriptions)
        )
        : 0,
      newCustomersThisMonth: 127, // Mock data
      failedPayments: 5, // Mock data
      refunds: 1200, // Mock data
      topPlans: topPlansWithPercentages,
      recentPayments,
      revenueGrowth,
    }

    return NextResponse.json(metrics)
  } catch (error) {
    captureError(error, { scope: 'stripe.metrics' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
