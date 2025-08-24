import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

// Static pages mapping
const staticPages: Record<string, { title: string; content: string }> = {
  about: {
    title: 'About SaaS Yacht Club',
    content:
      'We help SaaS founders build and scale their businesses with the best tools and community.',
  },
  pricing: {
    title: 'Pricing - SaaS Yacht Club',
    content: 'Simple, transparent pricing for SaaS founders at every stage.',
  },
  contact: {
    title: 'Contact Us - SaaS Yacht Club',
    content: 'Get in touch with the SaaS Yacht Club team.',
  },
  blog: {
    title: 'Blog - SaaS Yacht Club',
    content: 'Insights and stories from SaaS founders and developers.',
  },
  docs: {
    title: 'Documentation - SaaS Yacht Club',
    content: 'Comprehensive guides and API documentation.',
  },
  help: {
    title: 'Help Center - SaaS Yacht Club',
    content: 'Find answers to common questions and get support.',
  },
  privacy: {
    title: 'Privacy Policy - SaaS Yacht Club',
    content: 'How we protect and handle your data.',
  },
  terms: {
    title: 'Terms of Service - SaaS Yacht Club',
    content: 'Terms and conditions for using SaaS Yacht Club.',
  },
}

interface MarketingPageProps {
  params: Promise<{
    slug: string[]
  }>
}

export async function generateMetadata({ params }: MarketingPageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = staticPages[slugPath]

  if (!page) {
    return {
      title: 'Page Not Found - SaaS Yacht Club',
    }
  }

  return {
    title: page.title,
    description: page.content,
    openGraph: {
      title: page.title,
      description: page.content,
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.content,
    },
  }
}

export default async function MarketingPage({ params }: MarketingPageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = staticPages[slugPath]

  if (!page) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">{page.title}</h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-xl text-muted-foreground mb-8">{page.content}</p>

            {/* Placeholder content based on page type */}
            {slugPath === 'about' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Our Mission</h2>
                <p>
                  At SaaS Yacht Club, we believe that building a successful SaaS business
                  shouldn&apos;t be a solo journey. We&apos;re here to provide the tools, community,
                  and support that SaaS founders need to thrive.
                </p>

                <h2 className="text-2xl font-semibold">What We Offer</h2>
                <ul className="space-y-2">
                  <li>🎯 Comprehensive SaaS boilerplate with modern tech stack</li>
                  <li>👥 Community of like-minded SaaS founders</li>
                  <li>🛠️ Best practices and proven strategies</li>
                  <li>📚 Educational resources and guides</li>
                  <li>💼 Networking opportunities</li>
                </ul>
              </div>
            )}

            {slugPath === 'pricing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">Simple, Transparent Pricing</h2>
                <p>
                  We offer flexible pricing plans designed for SaaS founders at every stage of their
                  journey.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Starter</h3>
                    <div className="text-3xl font-bold mb-4">
                      $29<span className="text-lg font-normal">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>✅ Basic boilerplate access</li>
                      <li>✅ Community forum access</li>
                      <li>✅ Basic support</li>
                    </ul>
                  </div>

                  <div className="border-2 border-primary rounded-lg p-6 bg-primary/5">
                    <h3 className="text-xl font-semibold mb-2">Professional</h3>
                    <div className="text-3xl font-bold mb-4">
                      $99<span className="text-lg font-normal">/month</span>
                    </div>
                    <ul className="space-y-2 text-sm">
                      <li>✅ Everything in Starter</li>
                      <li>✅ Advanced features</li>
                      <li>✅ Priority support</li>
                      <li>✅ Private Discord</li>
                    </ul>
                  </div>

                  <div className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
                    <div className="text-3xl font-bold mb-4">Custom</div>
                    <ul className="space-y-2 text-sm">
                      <li>✅ Everything in Professional</li>
                      <li>✅ Custom development</li>
                      <li>✅ Dedicated support</li>
                      <li>✅ White-label options</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
