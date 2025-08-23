import { z } from 'zod'

// Product creation schema (admin only)
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(255, 'Product name must be less than 255 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  features: z.array(z.string()).default([]),
  stripePriceId: z.string().optional(),
  stripeProductId: z.string().optional(),
})

// Subscription schema
export const subscriptionCreateSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  paymentMethodId: z.string().optional(),
})

// Checkout session schema
export const checkoutSessionSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  successUrl: z.string().url('Invalid success URL'),
  cancelUrl: z.string().url('Invalid cancel URL'),
})

// Webhook event schema
export const webhookEventSchema = z.object({
  id: z.string(),
  object: z.string(),
  api_version: z.string(),
  created: z.number(),
  data: z.object({
    object: z.any(),
  }),
  livemode: z.boolean(),
  pending_webhooks: z.number(),
  request: z.object({
    id: z.string().optional(),
    idempotency_key: z.string().optional(),
  }).optional(),
  type: z.string(),
})

// Customer portal schema
export const customerPortalSchema = z.object({
  returnUrl: z.string().url('Invalid return URL'),
})
