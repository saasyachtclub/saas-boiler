import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { AdminHeader } from '@/components/admin/admin-header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect('/auth/login')
  }

  // Check if user has admin role
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  })

  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    redirect('/dashboard')
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar user={user} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
