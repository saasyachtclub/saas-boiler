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
  header: (msg: string) => console.log(`\n${colors.bold}${colors.cyan}🔧 ${msg}${colors.reset}`),
  step: (step: number, msg: string) =>
    console.log(`\n${colors.magenta}${step}.${colors.reset} ${colors.bold}${msg}${colors.reset}`),
}

async function diagnoseIssues() {
  log.header('Diagnosing Common Issues...')

  const issues = []

  // Check Node version
  const nodeVersion = process.version
  const majorVersion = Number.parseInt(nodeVersion.slice(1).split('.')[0])
  if (majorVersion < 20) {
    issues.push({
      type: 'error',
      message: `Node.js version ${nodeVersion} is not supported. Please use Node.js 20 or higher.`,
    })
  } else {
    log.success(`Node.js ${nodeVersion} ✓`)
  }

  // Check if .env exists
  const envPath = join(process.cwd(), '.env')
  if (!existsSync(envPath)) {
    issues.push({
      type: 'warning',
      message: '.env file not found. This may cause runtime errors.',
    })
  } else {
    log.success('.env file exists ✓')
  }

  // Check if package.json exists
  const pkgPath = join(process.cwd(), 'package.json')
  if (!existsSync(pkgPath)) {
    issues.push({
      type: 'error',
      message: 'package.json not found. This is a critical issue.',
    })
  } else {
    log.success('package.json exists ✓')
  }

  // Check if node_modules exists
  const nodeModulesPath = join(process.cwd(), 'node_modules')
  if (!existsSync(nodeModulesPath)) {
    issues.push({
      type: 'warning',
      message: 'node_modules not found. Run pnpm install to install dependencies.',
    })
  } else {
    log.success('node_modules exists ✓')
  }

  // Check if pnpm-lock.yaml exists
  const lockfilePath = join(process.cwd(), 'pnpm-lock.yaml')
  if (!existsSync(lockfilePath)) {
    issues.push({
      type: 'warning',
      message: 'pnpm-lock.yaml not found. This may cause dependency issues.',
    })
  } else {
    log.success('pnpm-lock.yaml exists ✓')
  }

  return issues
}

async function fixDependencies() {
  try {
    log.step(1, 'Fixing Dependencies')
    log.info('Reinstalling dependencies...')

    // Remove node_modules and lockfile
    execSync('rm -rf node_modules pnpm-lock.yaml', { stdio: 'inherit' })

    // Reinstall
    execSync('pnpm install', { stdio: 'inherit' })

    log.success('Dependencies fixed ✓')
  } catch (error) {
    log.error('Failed to fix dependencies')
    throw error
  }
}

async function fixEnvironment() {
  try {
    log.step(1, 'Fixing Environment Variables')
    const envPath = join(process.cwd(), '.env')
    const envExamplePath = join(process.cwd(), 'env-complete.example')

    if (!existsSync(envPath) && existsSync(envExamplePath)) {
      log.info('Creating .env file from template...')
      execSync(`cp ${envExamplePath} ${envPath}`)
      log.success('Environment file created')
      log.warning('Please edit .env with your actual credentials!')
    } else {
      log.success('Environment is properly configured')
    }
  } catch (error) {
    log.error('Failed to fix environment')
    throw error
  }
}

async function fixDatabase() {
  try {
    log.step(1, 'Fixing Database Connection')
    log.info('Testing database connection...')

    try {
      execSync('pnpm db:generate', { stdio: 'pipe' })
      log.success('Database connection working ✓')
    } catch (error) {
      log.warning('Database connection failed. Make sure DATABASE_URL is set correctly.')
      log.info('You may need to:')
      log.info('1. Check your DATABASE_URL in .env')
      log.info('2. Make sure your Neon database is running')
      log.info('3. Run: pnpm db:push to sync schema')
    }
  } catch (error) {
    log.error('Database fix failed')
  }
}

async function fixBuildIssues() {
  try {
    log.step(1, 'Fixing Build Issues')
    log.info('Clearing build cache...')

    // Clear Next.js cache
    execSync('rm -rf apps/web/.next', { stdio: 'inherit' })

    // Clear Turbo cache
    execSync('rm -rf .turbo', { stdio: 'inherit' })

    log.success('Build cache cleared ✓')
  } catch (error) {
    log.error('Failed to clear build cache')
  }
}

async function fixLintIssues() {
  try {
    log.step(1, 'Fixing Linting Issues')
    log.info('Running auto-fix...')

    execSync('pnpm fix', { stdio: 'inherit' })

    log.success('Linting issues fixed ✓')
  } catch (error) {
    log.warning('Some linting issues could not be auto-fixed')
    log.info('Run: pnpm lint to see remaining issues')
  }
}

async function runHealthCheck() {
  try {
    log.step(1, 'Running Health Check')
    log.info('Checking system health...')

    // Check if all scripts are available
    const scripts = [
      'dev',
      'build',
      'lint',
      'format',
      'check',
      'fix',
      'db:generate',
      'db:migrate',
      'db:studio',
      'db:push',
    ]

    for (const script of scripts) {
      try {
        execSync(`pnpm run ${script} --help`, { stdio: 'pipe' })
        log.success(`Script '${script}' available ✓`)
      } catch {
        log.warning(`Script '${script}' not available`)
      }
    }

    log.success('Health check completed ✓')
  } catch (error) {
    log.error('Health check failed')
  }
}

async function main() {
  console.clear()
  log.header('SaaS Yacht Club - Repair CLI')
  log.info('Diagnosing and fixing common issues...')

  try {
    // Step 1: Diagnose issues
    const issues = await diagnoseIssues()

    if (issues.length > 0) {
      log.header('Issues Found:')
      issues.forEach((issue, index) => {
        const color = issue.type === 'error' ? colors.red : colors.yellow
        console.log(`${color}${index + 1}.${colors.reset} ${issue.message}`)
      })

      const shouldFix = await question('\nDo you want to attempt to fix these issues? (y/n): ')

      if (shouldFix.toLowerCase() !== 'y') {
        log.info('Repair cancelled')
        return
      }
    } else {
      log.success('No issues detected! Your project looks healthy.')
      const shouldRunHealthCheck = await question(
        'Run a comprehensive health check anyway? (y/n): '
      )

      if (shouldRunHealthCheck.toLowerCase() === 'y') {
        await runHealthCheck()
      }

      return
    }

    // Step 2: Fix issues
    const fixType = await question(`
What do you want to fix?

1. Dependencies (reinstall node_modules)
2. Environment variables (create .env)
3. Database connection
4. Build cache (clear .next and cache)
5. Linting issues (auto-fix)
6. Everything (comprehensive fix)
7. Cancel

Choose an option (1-7): `)

    switch (fixType) {
      case '1':
        await fixDependencies()
        break

      case '2':
        await fixEnvironment()
        break

      case '3':
        await fixDatabase()
        break

      case '4':
        await fixBuildIssues()
        break

      case '5':
        await fixLintIssues()
        break

      case '6':
        log.header('Comprehensive Fix')
        await fixDependencies()
        await fixEnvironment()
        await fixDatabase()
        await fixBuildIssues()
        await fixLintIssues()
        break

      case '7':
        log.info('Repair cancelled')
        return

      default:
        log.error('Invalid option')
        return
    }

    // Step 3: Final verification
    if (fixType !== '7') {
      log.header('Verification')
      log.info('Re-checking issues...')

      const remainingIssues = await diagnoseIssues()

      if (remainingIssues.length === 0) {
        log.success('🎉 All issues resolved!')
      } else {
        log.warning('Some issues remain. You may need to fix them manually.')
        remainingIssues.forEach((issue, index) => {
          const color = issue.type === 'error' ? colors.red : colors.yellow
          console.log(`${color}${index + 1}.${colors.reset} ${issue.message}`)
        })
      }

      log.header('Next Steps')
      console.log('\n🔧 Useful Commands:')
      console.log('- pnpm dev          # Start development server')
      console.log('- pnpm build        # Build for production')
      console.log('- pnpm setup        # Re-run setup wizard')
      console.log('- pnpm reset        # Reset various parts of the project')
      console.log('- pnpm repair       # Run this repair tool again')

      console.log('\n📚 If you still have issues, check:')
      console.log('- Your .env file has correct values')
      console.log('- Your database is running and accessible')
      console.log('- Node.js version is 20 or higher')
      console.log('- All required services are running')
    }
  } catch (error) {
    log.error(`Repair failed: ${error}`)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main().catch(console.error)
