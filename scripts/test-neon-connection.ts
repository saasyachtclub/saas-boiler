#!/usr/bin/env node

import { neon } from '@neondatabase/serverless'

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bold}${colors.cyan}🌐 ${msg}${colors.reset}`)
}

async function testNeonConnection() {
  log.header('Testing Neon Database Connection')

  const databaseUrl = process.env.DATABASE_URL

  if (!databaseUrl) {
    log.error('DATABASE_URL environment variable is not set!')
    log.info('Make sure your .env file contains the DATABASE_URL from Neon.')
    process.exit(1)
  }

  try {
    log.info('Connecting to Neon database...')

    // Create connection
    const sql = neon(databaseUrl)

    // Test connection with a simple query
    const result = await sql`SELECT NOW() as current_time, version() as db_version`

    if (result && result.length > 0) {
      log.success('Database connection successful! ✓')
      log.info(`Current time: ${result[0].current_time}`)
      log.info(`Database version: ${result[0].db_version.split(' ')[0]}...`)

      // Test if we can access the database structure
      try {
        const tables = await sql`
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          ORDER BY table_name
        `

        if (tables && tables.length > 0) {
          log.success(`Found ${tables.length} tables in database:`)
          tables.forEach((table: any) => {
            console.log(`  - ${table.table_name}`)
          })
        } else {
          log.info('No tables found in database (this is normal for a fresh database)')
        }
      } catch (tableError) {
        log.warning('Could not list tables, but connection is working')
      }

    } else {
      throw new Error('No response from database')
    }

  } catch (error) {
    log.error('Database connection failed!')
    log.error(`Error: ${error}`)

    console.log('\n🔧 Troubleshooting tips:')
    console.log('1. Check your DATABASE_URL in .env file')
    console.log('2. Make sure your Neon database is active')
    console.log('3. Verify your network connection')
    console.log('4. Check if your IP is whitelisted in Neon')
    console.log('5. Try copying the connection string from Neon console again')

    console.log('\n📋 Your current DATABASE_URL:')
    console.log(databaseUrl)

    process.exit(1)
  }
}

testNeonConnection().catch(console.error)
