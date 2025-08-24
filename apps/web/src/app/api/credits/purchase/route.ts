import { auth } from '@/lib/auth'
import { purchaseCredits } from '@/lib/credits'
import { captureError, withAxiom } from '@/lib/logging'
import { purchaseCreditsSchema } from '@/lib/schemas'
import { NextResponse, type NextRequest } from 'next/server'

export const POST = withAxiom(async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { packageType } = purchaseCreditsSchema.parse(body)

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?success=true`
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits?canceled=true`

    const checkoutSession = await purchaseCredits(
      session.user.id,
      packageType as 'starter' | 'pro' | 'enterprise' | 'custom',
      successUrl,
      cancelUrl
    )

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    captureError(error, { scope: 'credits.purchase' })
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
})
