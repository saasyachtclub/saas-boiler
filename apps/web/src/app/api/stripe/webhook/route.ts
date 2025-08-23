import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeWebhookSecret } from '@/lib/stripe'
import { db } from '@/lib/db'
import { subscriptions, products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature || !stripeWebhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: any

  try {
    event = stripe.webhooks.constructEvent(body, signature, stripeWebhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
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
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: any) {
  const customerId = session.customer
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) {
    throw new Error('Customer was deleted')
  }

  const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
  const priceId = lineItems.data[0].price.id

  const product = await db.query.products.findFirst({
    where: eq(products.stripePriceId, priceId),
  })

  if (!product) {
    throw new Error('Product not found')
  }

  // Create subscription record
  await db.insert(subscriptions).values({
    userId: customer.metadata.userId,
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
