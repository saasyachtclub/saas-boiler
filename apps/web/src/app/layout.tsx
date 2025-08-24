import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'SaaS Yacht Club - Ultimate FREE SaaS Boilerplate',
    template: '%s | SaaS Yacht Club'
  },
  description: '⚓ The ultimate FREE & Open Source SaaS boilerplate with Next.js 15, React 19, Better Auth, Stripe, Neon PostgreSQL, and Drizzle ORM. Production-ready with authentication, payments, multi-tenant architecture.',
  keywords: [
    'saas',
    'boilerplate', 
    'nextjs',
    'react',
    'typescript',
    'stripe',
    'better-auth',
    'neon',
    'postgresql',
    'drizzle',
    'shadcn-ui',
    'tailwindcss',
    'free',
    'open-source',
    'yacht-club'
  ],
  authors: [
    {
      name: 'SaaS Yacht Club',
      url: 'https://saasyachtclub.com',
    },
  ],
  creator: 'SaaS Yacht Club',
  publisher: 'SaaS Yacht Club',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://saasyachtclub.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://saasyachtclub.com',
    title: 'SaaS Yacht Club - Ultimate FREE SaaS Boilerplate',
    description: '⚓ The ultimate FREE & Open Source SaaS boilerplate. Production-ready with Next.js 15, React 19, authentication, payments, and multi-tenant architecture.',
    siteName: 'SaaS Yacht Club',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SaaS Yacht Club - Ultimate SaaS Boilerplate',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SaaS Yacht Club - Ultimate FREE SaaS Boilerplate',
    description: '⚓ The ultimate FREE & Open Source SaaS boilerplate. Production-ready with Next.js 15, React 19, authentication, payments, and multi-tenant architecture.',
    site: '@saasyachtclub',
    creator: '@saasyachtclub',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
