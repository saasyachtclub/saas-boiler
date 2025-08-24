#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { join } from 'path'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve))
}

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bold}${colors.cyan}🚢 ${msg}${colors.reset}`),
  step: (step: number, msg: string) =>
    console.log(`\n${colors.magenta}${step}.${colors.reset} ${colors.bold}${msg}${colors.reset}`),
}

async function main() {
  console.clear()
  log.header('SaaS Yacht Club - Interactive Setup')
  log.info('Welcome to the ultimate SaaS boilerplate setup!')

  try {
    // Step 1: Check Node version
    log.step(1, 'Checking Node.js version...')
    const nodeVersion = process.version
    const majorVersion = Number.parseInt(nodeVersion.slice(1).split('.')[0])

    if (majorVersion < 20) {
      log.error(`Node.js version ${nodeVersion} is not supported. Please use Node.js 20 or higher.`)
      process.exit(1)
    }
    log.success(`Node.js ${nodeVersion} ✓`)

    // Step 2: Check if .env exists
    log.step(2, 'Setting up environment variables...')
    const envPath = join(process.cwd(), '.env')

    if (!existsSync(envPath)) {
      log.warning('.env file not found. Creating from template...')
      const envExamplePath = join(process.cwd(), 'env-complete.example')

      if (existsSync(envExamplePath)) {
        // Copy env example to .env
        execSync(`cp ${envExamplePath} ${envPath}`)
        log.success('Created .env file from template')
        log.warning('Please edit .env file with your actual credentials!')
      } else {
        log.error('env-complete.example not found!')
      }
    } else {
      log.success('.env file already exists')
    }

    // Step 3: Install dependencies
    log.step(3, 'Installing dependencies...')
    try {
      execSync('pnpm install', { stdio: 'inherit' })
      log.success('Dependencies installed ✓')
    } catch (error) {
      log.error('Failed to install dependencies')
      throw error
    }

    // Step 4: Generate database schema
    log.step(4, 'Setting up database...')
    const shouldSetupDb = await question('Do you want to setup the database? (y/n): ')

    if (shouldSetupDb.toLowerCase() === 'y') {
      try {
        log.info('Generating database schema...')
        execSync('pnpm db:generate', { stdio: 'inherit' })
        log.success('Database schema generated ✓')
      } catch (error) {
        log.warning('Failed to generate database schema. Make sure DATABASE_URL is set.')
      }
    }

    // Step 5: Setup Vercel (optional)
    log.step(5, 'Vercel integration...')
    const shouldSetupVercel = await question('Do you want to setup Vercel integration? (y/n): ')

    if (shouldSetupVercel.toLowerCase() === 'y') {
      try {
        log.info('Setting up Vercel...')
        execSync('pnpm vercel:setup', { stdio: 'inherit' })
        log.success('Vercel setup completed ✓')
      } catch (error) {
        log.warning('Vercel setup failed. You can run it manually later.')
      }
    }

    // Step 6: Create admin user (optional)
    log.step(6, 'Admin user setup...')
    const shouldCreateAdmin = await question('Do you want to create an admin user? (y/n): ')

    if (shouldCreateAdmin.toLowerCase() === 'y') {
      try {
        log.info('Creating admin user...')
        execSync('pnpm admin create-admin', { stdio: 'inherit' })
        log.success('Admin user created ✓')
      } catch (error) {
        log.warning('Failed to create admin user. Make sure database is setup first.')
      }
    }

    // Step 7: Final instructions
    log.header('🎉 Setup Complete!')
    log.success('SaaS Yacht Club is ready to sail!')

    console.log('\n📋 Next Steps:')
    console.log('1. Edit your .env file with actual credentials')
    console.log('2. Run database migrations: pnpm db:migrate')
    console.log('3. Start development server: pnpm dev')
    console.log('4. Open http://localhost:3000 in your browser')

    console.log('\n🔧 Useful Commands:')
    console.log('- pnpm dev          # Start development server')
    console.log('- pnpm build        # Build for production')
    console.log('- pnpm db:studio    # Open database studio')
    console.log('- pnpm admin        # Admin CLI commands')
    console.log('- pnpm setup        # Re-run this setup')
    console.log('- pnpm reset        # Reset everything')
    console.log('- pnpm repair       # Fix common issues')

    console.log('\n🌐 Deploy to Vercel:')
    console.log('- pnpm vercel:deploy    # Deploy to production')
    console.log('- pnpm vercel:preview   # Deploy to preview')
  } catch (error) {
    log.error(`Setup failed: ${error}`)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main().catch(console.error)
