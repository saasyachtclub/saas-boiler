import { auth } from '@/lib/auth'
import { getCreditHistory, getUsageStats, getUserCreditBalance } from '@/lib/credits'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { captureError, withAxiom } from '@/lib/logging'
import { eq } from 'drizzle-orm'
import { NextResponse, type NextRequest } from 'next/server'

export const GET = withAxiom(async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    switch (action) {
      case 'balance': {
        const balance = await getUserCreditBalance(session.user.id)
        return NextResponse.json({ balance })
      }

      case 'history': {
        const limit = Number.parseInt(url.searchParams.get('limit') || '50')
        const offset = Number.parseInt(url.searchParams.get('offset') || '0')
        const history = await getCreditHistory(session.user.id, limit, offset)
        return NextResponse.json({ history })
      }

      case 'stats': {
        const days = Number.parseInt(url.searchParams.get('days') || '30')
        const stats = await getUsageStats(session.user.id, days)
        return NextResponse.json({ stats })
      }

      default: {
        // Get basic credit info
        const [defaultBalance, user] = await Promise.all([
          getUserCreditBalance(session.user.id),
          db.query.users.findFirst({
            where: eq(users.id, session.user.id),
            columns: { credits: true },
          }),
        ])

        return NextResponse.json({
          balance: defaultBalance,
          userBalance: user?.credits || 0,
        })
      }
    }
  } catch (error) {
    captureError(error, { scope: 'credits.get' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})
