import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SaaS Better - Ultimate SaaS Boilerplate',
  description:
    'The ultimate SaaS boilerplate with Next.js 15, React 19, Better Auth, Stripe, Neon, and Drizzle ORM',
  keywords: ['saas', 'boilerplate', 'nextjs', 'react', 'typescript', 'stripe', 'auth'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
