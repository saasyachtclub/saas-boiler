import { db } from '@/lib/db'
import { products, subscriptions } from '@/lib/db/schema'
import { captureError, log, withAxiom } from '@/lib/logging'
import { stripe, stripeWebhookSecret } from '@/lib/stripe'
import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'

export const POST = withAxiom(async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !stripeWebhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
  } catch (err) {
    captureError(err, { scope: 'stripe.webhook', stage: 'verify' })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      default:
        log('info', 'Unhandled Stripe event', { type: event.type })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    captureError(error, { scope: 'stripe.webhook', stage: 'handle', eventType: event?.type })
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
})

async function handleCheckoutCompleted(session: any) {
  const customerId = session.customer
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) {
    throw new Error('Customer was deleted')
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
  if (!lineItems.data[0] || !lineItems.data[0].price) {
    throw new Error('Line item or price not found')
  }
  const priceId = lineItems.data[0].price.id

  const product = await db.query.products.findFirst({
    where: eq(products.stripePriceId, priceId),
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // Create subscription record
  const userId = customer.metadata.userId
  if (!userId) {
    throw new Error("Customer userId not found in metadata")
  }  await db.insert(subscriptions).values({
    userId: userId,
    productId: product.id,
    stripeSubscriptionId: session.subscription,
    status: 'active',
    currentPeriodStart: new Date(session.current_period_start * 1000),
    currentPeriodEnd: new Date(session.current_period_end * 1000),
  })
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  if (invoice.subscription) {
    await db
      .update(subscriptions)
      .set({
        status: 'active',
        currentPeriodStart: new Date(invoice.period_start * 1000),
        currentPeriodEnd: new Date(invoice.period_end * 1000),
      })
      .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription))
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  if (invoice.subscription) {
    await db
      .update(subscriptions)
      .set({ status: 'past_due' })
      .where(eq(subscriptions.stripeSubscriptionId, invoice.subscription))
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  await db
    .update(subscriptions)
    .set({
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
}

async function handleSubscriptionDeleted(subscription: any) {
  await db
    .update(subscriptions)
    .set({ status: 'canceled' })
    .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
}
