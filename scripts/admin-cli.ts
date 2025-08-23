#!/usr/bin/env tsx

import { Command } from 'commander'
import { db } from '../apps/web/src/lib/db'
import { users } from '../apps/web/src/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import * as bcrypt from 'bcrypt'

const program = new Command()

program
  .name('saas-admin')
  .description('Admin CLI for SaaS Better')
  .version('1.0.0')

program
  .command('create-admin')
  .description('Create a new admin user')
  .requiredOption('-e, --email <email>', 'Admin email')
  .requiredOption('-p, --password <password>', 'Admin password')
  .requiredOption('-n, --name <name>', 'Admin name')
  .action(async (options) => {
    try {
      // Check if user already exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, options.email),
      })

      if (existingUser) {
        console.error('User with this email already exists')
        process.exit(1)
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(options.password, 12)

      // Create admin user
      const [adminUser] = await db.insert(users).values({
        email: options.email,
        name: options.name,
        role: 'super_admin',
        isActive: true,
        emailVerified: true,
      }).returning()

      console.log(`✅ Admin user created successfully!`)
      console.log(`Email: ${options.email}`)
      console.log(`Name: ${options.name}`)
      console.log(`Role: super_admin`)
    } catch (error) {
      console.error('Error creating admin user:', error)
      process.exit(1)
    }
  })

program
  .command('list-users')
  .description('List all users')
  .option('-r, --role <role>', 'Filter by role')
  .option('-l, --limit <limit>', 'Limit number of users', '10')
  .action(async (options) => {
    try {
      let query = db.select().from(users).limit(parseInt(options.limit))

      if (options.role) {
        query = query.where(eq(users.role, options.role))
      }

      const userList = await query

      console.log(`\n📋 Users (${userList.length})`)
      console.log('─'.repeat(80))

      userList.forEach(user => {
        console.log(`${user.name || 'No name'} <${user.email}> - ${user.role} - ${user.isActive ? 'Active' : 'Inactive'}`)
      })
    } catch (error) {
      console.error('Error listing users:', error)
      process.exit(1)
    }
  })

program
  .command('update-user-role')
  .description('Update user role')
  .requiredOption('-e, --email <email>', 'User email')
  .requiredOption('-r, --role <role>', 'New role (user, admin, super_admin)')
  .action(async (options) => {
    try {
      const validRoles = ['user', 'admin', 'super_admin']
      if (!validRoles.includes(options.role)) {
        console.error('Invalid role. Must be one of:', validRoles.join(', '))
        process.exit(1)
      }

      const user = await db.query.users.findFirst({
        where: eq(users.email, options.email),
      })

      if (!user) {
        console.error('User not found')
        process.exit(1)
      }

      await db.update(users)
        .set({ role: options.role })
        .where(eq(users.email, options.email))

      console.log(`✅ User role updated successfully!`)
      console.log(`Email: ${options.email}`)
      console.log(`New role: ${options.role}`)
    } catch (error) {
      console.error('Error updating user role:', error)
      process.exit(1)
    }
  })

program
  .command('toggle-user-status')
  .description('Toggle user active status')
  .requiredOption('-e, --email <email>', 'User email')
  .action(async (options) => {
    try {
      const user = await db.query.users.findFirst({
        where: eq(users.email, options.email),
      })

      if (!user) {
        console.error('User not found')
        process.exit(1)
      }

      const newStatus = !user.isActive

      await db.update(users)
        .set({ isActive: newStatus })
        .where(eq(users.email, options.email))

      console.log(`✅ User status updated successfully!`)
      console.log(`Email: ${options.email}`)
      console.log(`New status: ${newStatus ? 'Active' : 'Inactive'}`)
    } catch (error) {
      console.error('Error updating user status:', error)
      process.exit(1)
    }
  })

program
  .command('delete-user')
  .description('Delete a user (DANGER: This action cannot be undone)')
  .requiredOption('-e, --email <email>', 'User email')
  .option('-f, --force', 'Skip confirmation')
  .action(async (options) => {
    try {
      if (!options.force) {
        console.log('⚠️  This action cannot be undone!')
        console.log('Type "CONFIRM" to proceed:')
        process.stdin.resume()
        process.stdin.setEncoding('utf8')

        const confirm = await new Promise<string>((resolve) => {
          process.stdin.on('data', (data) => {
            resolve(data.toString().trim())
          })
        })

        if (confirm !== 'CONFIRM') {
          console.log('Operation cancelled')
          process.exit(0)
        }
      }

      const user = await db.query.users.findFirst({
        where: eq(users.email, options.email),
      })

      if (!user) {
        console.error('User not found')
        process.exit(1)
      }

      await db.delete(users).where(eq(users.email, options.email))

      console.log(`✅ User deleted successfully!`)
      console.log(`Email: ${options.email}`)
    } catch (error) {
      console.error('Error deleting user:', error)
      process.exit(1)
    }
  })

program
  .command('stats')
  .description('Show system statistics')
  .action(async () => {
    try {
      const totalUsers = await db.select({ count: count() }).from(users)
      const activeUsers = await db.select({ count: count() }).from(users).where(eq(users.isActive, true))
      const adminUsers = await db.select({ count: count() }).from(users).where(eq(users.role, 'admin'))
      const superAdminUsers = await db.select({ count: count() }).from(users).where(eq(users.role, 'super_admin'))

      console.log('\n📊 System Statistics')
      console.log('─'.repeat(40))
      console.log(`Total Users: ${totalUsers[0]?.count || 0}`)
      console.log(`Active Users: ${activeUsers[0]?.count || 0}`)
      console.log(`Admin Users: ${adminUsers[0]?.count || 0}`)
      console.log(`Super Admin Users: ${superAdminUsers[0]?.count || 0}`)
    } catch (error) {
      console.error('Error fetching statistics:', error)
      process.exit(1)
    }
  })

program.parse()
