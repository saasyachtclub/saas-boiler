import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe'
import { checkoutSessionSchema } from '@/lib/schemas'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productId, successUrl, cancelUrl } = checkoutSessionSchema.parse(body)

    // Get product details
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    })

    if (!product || !product.stripePriceId) {
      return NextResponse.json({ error: 'Product not found or not configured for Stripe' }, { status: 404 })
    }

    // Create or get Stripe customer
    const customer = await getOrCreateCustomer(session.user.email, session.user.name)

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      priceId: product.stripePriceId,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
