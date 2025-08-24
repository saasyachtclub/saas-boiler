import { db } from '@/lib/db'
import { products, subscriptions } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is required')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-07-30.basil' as any,
  typescript: true,
})

// Webhook secret for signature verification
export const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Price lookup by ID
export async function getProductByStripePriceId(priceId: string) {
  return await db.query.products.findFirst({
    where: eq(products.stripePriceId, priceId),
  })
}

// Get subscription by Stripe subscription ID
export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  return await db.query.subscriptions.findFirst({
    where: eq(subscriptions.stripeSubscriptionId, stripeSubscriptionId),
  })
}

// Create or retrieve customer
export async function getOrCreateCustomer(email: string, name?: string) {
  const customers = await stripe.customers.list({ email })

  if (customers.data.length > 0) {
    return customers.data[0]
  }

  return await stripe.customers.create({
    email,
    name: name || email,
  })
}

// Create checkout session
export async function createCheckoutSession({
  customerId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  customerId: string
  priceId: string
  successUrl: string
  cancelUrl: string
}) {
  return await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
    billing_address_collection: 'required',
  })
}

// Create customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })
}

// Cancel subscription
export async function cancelSubscription(stripeSubscriptionId: string) {
  return await stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: true,
  })
}

// Reactivate subscription
export async function reactivateSubscription(stripeSubscriptionId: string) {
  return await stripe.subscriptions.update(stripeSubscriptionId, {
    cancel_at_period_end: false,
  })
}

export type StripeCustomer = Stripe.Customer
export type StripeSubscription = Stripe.Subscription
export type StripePrice = Stripe.Price
export type StripeProduct = Stripe.Product
