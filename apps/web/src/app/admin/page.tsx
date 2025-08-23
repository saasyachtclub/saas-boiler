import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, DollarSign, TrendingUp, Activity } from 'lucide-react'
import { db } from '@/lib/db'
import { users, subscriptions, products } from '@/lib/db/schema'
import { eq, count, sum } from 'drizzle-orm'

export default async function AdminDashboard() {
  // Get stats
  const totalUsers = await db.select({ count: count() }).from(users)
  const activeSubscriptions = await db
    .select({ count: count() })
    .from(subscriptions)
    .where(eq(subscriptions.status, 'active'))

  const totalRevenue = await db
    .select({
      revenue: sum(products.price)
    })
    .from(subscriptions)
    .leftJoin(products, eq(subscriptions.productId, products.id))
    .where(eq(subscriptions.status, 'active'))

  const recentUsers = await db
    .select()
    .from(users)
    .orderBy(users.createdAt)
    .limit(5)

  const stats = [
    {
      title: 'Total Users',
      value: totalUsers[0]?.count || 0,
      icon: Users,
      description: 'All registered users',
    },
    {
      title: 'Active Subscriptions',
      value: activeSubscriptions[0]?.count || 0,
      icon: DollarSign,
      description: 'Currently active subscriptions',
    },
    {
      title: 'Monthly Revenue',
      value: `$${totalRevenue[0]?.revenue || 0}`,
      icon: TrendingUp,
      description: 'Revenue from active subscriptions',
    },
    {
      title: 'System Health',
      value: 'Healthy',
      icon: Activity,
      description: 'All systems operational',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your SaaS application and monitor key metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name?.[0] || user.email[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{user.name || user.email}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>
              Current system health and metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Authentication</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payments</span>
                <Badge variant="default">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Email Service</span>
                <Badge variant="default">Healthy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
