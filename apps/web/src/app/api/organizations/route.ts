import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { organizationMembers, organizations } from '@/lib/db/schema'
import { captureError, withAxiom } from '@/lib/logging'
import { and, eq, or } from 'drizzle-orm'
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

    if (action === 'my') {
      // Get organizations where user is a member
      const userOrganizations = await db
        .select({
          organization: organizations,
          role: organizationMembers.role,
          joinedAt: organizationMembers.joinedAt,
        })
        .from(organizationMembers)
        .leftJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
        .where(eq(organizationMembers.userId, session.user.id))

      return NextResponse.json({ organizations: userOrganizations })
    }

    if (action === 'owned') {
      // Get organizations where user is owner
      const ownedOrganizations = await db
        .select()
        .from(organizations)
        .where(eq(organizations.createdAt, organizations.createdAt)) // This should be filtered by owner

      return NextResponse.json({ organizations: ownedOrganizations })
    }

    // Get all organizations (admin only)
    if ((session.user as any).role === 'admin' || (session.user as any).role === 'super_admin') {
      const allOrganizations = await db.select().from(organizations)
      return NextResponse.json({ organizations: allOrganizations })
    }

    return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
  } catch (error) {
    captureError(error, { scope: 'organizations.get' })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
})

export const POST = withAxiom(async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, website, industry, size } = body

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // Check if slug is unique
    const existingOrg = await db.query.organizations.findFirst({
      where: eq(organizations.slug, slug),
    })

    if (existingOrg) {
      return NextResponse.json({ error: 'Organization name already taken' }, { status: 400 })
    }

    // Create organization
    const [organization] = await db
      .insert(organizations)
      .values({
        name,
        slug,
        description,
        website,
        industry,
        size,
      })
      .returning()

    if (!organization) {
      return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
    }
    // Add user as owner
    await db.insert(organizationMembers).values({
      organizationId: organization.id,
      userId: session.user.id,
      role: 'owner',
      joinedAt: new Date(),
    })

    return NextResponse.json({ organization }, { status: 201 })
  } catch (error) {
    captureError(error, { scope: 'organizations.post' })
    return NextResponse.json({ error: 'Failed to create organization' }, { status: 500 })
  }
})

export const PUT = withAxiom(async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const organizationId = url.searchParams.get('id')

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const body = await req.json()
    const { name, description, website, industry, size } = body

    // Check if user is owner or admin of the organization
    const membership = await db.query.organizationMembers.findFirst({
      where: and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, session.user.id),
        or(eq(organizationMembers.role, 'owner'), eq(organizationMembers.role, 'admin'))
      ),
    })

    if (!membership) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Update organization
    const [updatedOrg] = await db
      .update(organizations)
      .set({
        name,
        description,
        website,
        industry,
        size,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, organizationId))
      .returning()

    if (!updatedOrg) {
      return NextResponse.json({ error: "Failed to create organization" }, { status: 500 })
    }
    return NextResponse.json({ organization: updatedOrg })
  } catch (error) {
    captureError(error, { scope: 'organizations.put' })
    return NextResponse.json({ error: 'Failed to update organization' }, { status: 500 })
  }
})
