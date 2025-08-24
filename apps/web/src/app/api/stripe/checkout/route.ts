import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { products } from '@/lib/db/schema'
import { captureError, withAxiom } from '@/lib/logging'
import { checkoutSessionSchema } from '@/lib/schemas'
import { createCheckoutSession, getOrCreateCustomer } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'

export const POST = withAxiom(async function POST(req: NextRequest) {
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
      return NextResponse.json(
        { error: 'Product not found or not configured for Stripe' },
        { status: 404 }
      )
    }

    // Create or get Stripe customer
    const customer = await getOrCreateCustomer(session.user.email, session.user.name)

    if (!customer) {
      return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
    }
    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      priceId: product.stripePriceId,
      successUrl,
      cancelUrl,
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    captureError(error, { scope: 'stripe.checkout' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
