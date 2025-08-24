#!/usr/bin/env node

import { execSync } from 'child_process'
import { existsSync, rmSync } from 'fs'
import { join } from 'path'
import * as readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve))
}

const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

const log = {
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg: string) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bold}${colors.cyan}🔄 ${msg}${colors.reset}`),
  step: (step: number, msg: string) => console.log(`\n${colors.magenta}${step}.${colors.reset} ${colors.bold}${msg}${colors.reset}`)
}

async function resetDatabase() {
  try {
    log.info('Resetting database...')
    // Drop all tables and recreate schema
    execSync('pnpm db:push --force', { stdio: 'inherit' })
    log.success('Database reset complete')
  } catch (error) {
    log.warning('Database reset failed. You may need to manually reset your database.')
  }
}

async function resetEnvironment() {
  try {
    log.info('Resetting environment file...')
    const envPath = join(process.cwd(), '.env')
    const envExamplePath = join(process.cwd(), 'env-complete.example')

    if (existsSync(envExamplePath)) {
      execSync(`cp ${envExamplePath} ${envPath}`)
      log.success('Environment file reset from template')
    } else {
      log.warning('env-complete.example not found')
    }
  } catch (error) {
    log.error('Failed to reset environment file')
  }
}

async function resetNodeModules() {
  try {
    log.info('Resetting node_modules...')
    const nodeModulesPath = join(process.cwd(), 'node_modules')
    const lockfilePath = join(process.cwd(), 'pnpm-lock.yaml')

    if (existsSync(nodeModulesPath)) {
      rmSync(nodeModulesPath, { recursive: true, force: true })
      log.success('Removed node_modules')
    }

    if (existsSync(lockfilePath)) {
      rmSync(lockfilePath)
      log.success('Removed lockfile')
    }

    log.info('Reinstalling dependencies...')
    execSync('pnpm install', { stdio: 'inherit' })
    log.success('Dependencies reinstalled')
  } catch (error) {
    log.error('Failed to reset node_modules')
  }
}

async function resetBuildCache() {
  try {
    log.info('Clearing build cache...')
    const nextPath = join(process.cwd(), 'apps/web/.next')
    const cachePath = join(process.cwd(), 'apps/web/node_modules/.cache')

    if (existsSync(nextPath)) {
      rmSync(nextPath, { recursive: true, force: true })
      log.success('Cleared .next cache')
    }

    if (existsSync(cachePath)) {
      rmSync(cachePath, { recursive: true, force: true })
      log.success('Cleared webpack cache')
    }
  } catch (error) {
    log.error('Failed to clear build cache')
  }
}

async function main() {
  console.clear()
  log.header('SaaS Yacht Club - Reset CLI')
  log.warning('⚠️  This will reset various parts of your project. Be careful!')

  try {
    const resetType = await question(`
What do you want to reset?

1. Database only (keep schema, reset data)
2. Environment file (reset to template)
3. Dependencies (reinstall node_modules)
4. Build cache (clear .next and cache)
5. Everything (full reset)
6. Cancel

Choose an option (1-6): `)

    switch (resetType) {
      case '1':
        log.step(1, 'Database Reset')
        const dbConfirm = await question('This will delete all data. Are you sure? (y/n): ')
        if (dbConfirm.toLowerCase() === 'y') {
          await resetDatabase()
        } else {
          log.info('Database reset cancelled')
        }
        break

      case '2':
        log.step(1, 'Environment Reset')
        const envConfirm = await question('This will reset your .env file. Continue? (y/n): ')
        if (envConfirm.toLowerCase() === 'y') {
          await resetEnvironment()
        } else {
          log.info('Environment reset cancelled')
        }
        break

      case '3':
        log.step(1, 'Dependencies Reset')
        const depsConfirm = await question('This will reinstall all dependencies. Continue? (y/n): ')
        if (depsConfirm.toLowerCase() === 'y') {
          await resetNodeModules()
        } else {
          log.info('Dependencies reset cancelled')
        }
        break

      case '4':
        log.step(1, 'Cache Reset')
        await resetBuildCache()
        break

      case '5':
        log.step(1, 'Full Reset')
        const fullConfirm = await question('This will reset EVERYTHING. Are you absolutely sure? (y/n): ')
        if (fullConfirm.toLowerCase() === 'y') {
          const finalConfirm = await question('LAST CHANCE! Type "RESET" to confirm: ')
          if (finalConfirm === 'RESET') {
            log.warning('Starting full reset...')
            await resetDatabase()
            await resetEnvironment()
            await resetNodeModules()
            await resetBuildCache()
            log.success('Full reset completed!')
          } else {
            log.info('Full reset cancelled')
          }
        } else {
          log.info('Full reset cancelled')
        }
        break

      case '6':
        log.info('Reset cancelled')
        break

      default:
        log.error('Invalid option')
    }

    if (resetType !== '6') {
      log.header('Reset Complete!')
      log.info('You may need to restart your development server.')
      console.log('\n🔧 Useful Commands:')
      console.log('- pnpm dev          # Start development server')
      console.log('- pnpm setup        # Re-run setup wizard')
      console.log('- pnpm db:migrate   # Run database migrations')
    }

  } catch (error) {
    log.error(`Reset failed: ${error}`)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main().catch(console.error)
