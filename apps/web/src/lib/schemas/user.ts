import { z } from 'zod'

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be less than 100 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be less than 100 characters'),
  company: z.string().max(255, 'Company name must be less than 255 characters').optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  timezone: z.string().optional(),
})

// User preferences schema
export const userPreferencesSchema = z.object({
  emailNotifications: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
})

// API Key creation schema
export const apiKeyCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  permissions: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional(),
})

// User role update schema (admin only)
export const userRoleUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  role: z.enum(['user', 'admin', 'super_admin']),
})

// User status update schema (admin only)
export const userStatusUpdateSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  isActive: z.boolean(),
})
