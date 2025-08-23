#!/usr/bin/env tsx

import { execSync } from 'child_process'
import { existsSync, writeFileSync } from 'fs'
import { join } from 'path'
import * as dotenv from 'dotenv'

async function main() {
  console.log('🚀 Setting up SaaS Better...\n')

  // Check if .env already exists
  const envPath = join(process.cwd(), '.env')
  if (existsSync(envPath)) {
    console.log('⚠️  .env file already exists. Skipping environment setup.')
  } else {
    console.log('📝 Creating .env file...')

    const envTemplate = `# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="${generateSecret()}"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Stripe
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PUBLISHABLE_KEY=""

# Email (Optional - for transactional emails)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
FROM_EMAIL=""

# Next.js
NEXTAUTH_SECRET="${generateSecret()}"
NEXTAUTH_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL=""`

    writeFileSync(envPath, envTemplate)
    console.log('✅ .env file created successfully!')
  }

  // Install dependencies
  console.log('\n📦 Installing dependencies...')
  try {
    execSync('pnpm install', { stdio: 'inherit' })
    console.log('✅ Dependencies installed successfully!')
  } catch (error) {
    console.error('❌ Failed to install dependencies')
    process.exit(1)
  }

  // Generate database types
  console.log('\n🗄️  Generating database types...')
  try {
    execSync('pnpm db:generate', { stdio: 'inherit' })
    console.log('✅ Database types generated successfully!')
  } catch (error) {
    console.error('❌ Failed to generate database types')
    process.exit(1)
  }

  console.log('\n🎉 Setup completed successfully!')
  console.log('\nNext steps:')
  console.log('1. Update your .env file with your database URL and other credentials')
  console.log('2. Run "pnpm db:migrate" to apply database migrations')
  console.log('3. Run "pnpm dev" to start the development server')
  console.log('4. Create your first admin user with "pnpm admin create-admin -e your@email.com -p password -n "Your Name""')
  console.log('\n📚 For more information, check the README.md file')
}

function generateSecret(): string {
  return Array.from({ length: 32 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      [Math.floor(Math.random() * 62)]
  ).join('')
}

main().catch(console.error)
