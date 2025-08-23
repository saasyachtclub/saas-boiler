import { pgTable, text, integer, timestamp, boolean, uuid, varchar, decimal } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Users table (extends Better Auth)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('email_verified').default(false),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  role: text('role').default('user').notNull(), // 'user', 'admin', 'super_admin'
  isActive: boolean('is_active').default(true).notNull(),
})

// User sessions (Better Auth)
export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// User accounts (Better Auth)
export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Verification tokens (Better Auth)
export const verificationTokens = pgTable('verification_tokens', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Products/Plans
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stripePriceId: text('stripe_price_id').unique(),
  stripeProductId: text('stripe_product_id').unique(),
  features: text('features').array(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  status: text('status').notNull(), // 'active', 'canceled', 'past_due', 'incomplete'
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAtPeriodEnd: boolean('cancel_at_period_end').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// User profiles (extended user data)
export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  firstName: varchar('first_name', { length: 100 }),
  lastName: varchar('last_name', { length: 100 }),
  company: varchar('company', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  avatar: text('avatar'),
  timezone: varchar('timezone', { length: 50 }).default('UTC'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// API Keys
export const apiKeys = pgTable('api_keys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  key: text('key').unique().notNull(),
  permissions: text('permissions').array(),
  isActive: boolean('is_active').default(true).notNull(),
  expiresAt: timestamp('expires_at'),
  lastUsedAt: timestamp('last_used_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Audit logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  resourceId: text('resource_id'),
  details: text('details'),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  subscriptions: many(subscriptions),
  profile: many(profiles),
  apiKeys: many(apiKeys),
  auditLogs: many(auditLogs),
}))

export const productsRelations = relations(products, ({ many }) => ({
  subscriptions: many(subscriptions),
}))

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(users, { fields: [subscriptions.userId], references: [users.id] }),
  product: one(products, { fields: [subscriptions.productId], references: [products.id] }),
}))
