# 🚀 SaaS Better - Ultimate SaaS Boilerplate

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-1.3-green)](https://better-auth.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-purple)](https://stripe.com/)
[![Neon](https://img.shields.io/badge/Neon-Database-green)](https://neon.tech/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-orange)](https://orm.drizzle.team/)
[![Biome](https://img.shields.io/badge/Biome-1.9-green)](https://biomejs.dev/)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Components-black)](https://ui.shadcn.com/)
[![Turbo](https://img.shields.io/badge/Turbo-Monorepo-blue)](https://turbo.build/)

> The ultimate SaaS boilerplate built with Next.js 15, React 19, Better Auth, Stripe, Neon, and Drizzle ORM. Perfect for building and scaling your SaaS applications. Features a modern monorepo architecture with Turbo for maximum developer experience.

## ✨ Features

### 🛡️ **Authentication & Authorization**
- **Better Auth** - Modern authentication with email/password, social login, and magic links
- **Role-based access control** - User, Admin, and Super Admin roles
- **Protected routes** - Server-side route protection
- **Session management** - Secure session handling with middleware

### 💳 **Payments & Subscriptions**
- **Stripe integration** - Complete payment processing
- **Subscription management** - Handle recurring payments
- **Webhook support** - Real-time payment status updates
- **Customer portal** - Self-service subscription management

### 🗄️ **Database & ORM**
- **Neon PostgreSQL** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database queries
- **Auto-migrations** - Database schema management
- **Optimized queries** - Efficient data fetching

### 🎨 **UI & Components**
- **shadcn/ui** - Beautiful, accessible components
- **Tailwind CSS** - Utility-first CSS framework
- **Dark mode support** - Built-in theme switching
- **Responsive design** - Mobile-first approach

### 🛠️ **Developer Experience**
- **TypeScript** - Full type safety
- **Biome** - Fast linting and formatting
- **Next.js 15** - Latest App Router features
- **React 19** - Latest React features

### 👨‍💼 **Admin Panel**
- **User management** - View, edit, and manage users
- **Subscription oversight** - Monitor and manage subscriptions
- **Analytics dashboard** - Key metrics and insights
- **API key management** - Create and manage API keys

### 📱 **User Dashboard**
- **Profile management** - Update user information
- **Subscription details** - View and manage subscriptions
- **Billing history** - Payment and invoice history
- **API keys** - Manage personal API keys

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Neon** account for PostgreSQL database
- **Stripe** account for payments
- **GitHub** repository

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/saas-better.git
cd saas-better

# Run the automated setup script
./scripts/setup.sh
```

Or set up manually:

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env
```

Configure your environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-min-32-chars"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 3. Database Setup

```bash
# Generate database migration
pnpm db:generate

# Apply migration to database
pnpm db:migrate

# Open Drizzle Studio (optional)
pnpm db:studio
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── auth/             # Authentication configuration
│   ├── db/               # Database configuration
│   ├── schemas/          # Zod validation schemas
│   └── stripe/           # Stripe configuration
├── types/                # TypeScript type definitions
└── hooks/                # Custom React hooks
```

## 🗄️ Database Schema

The boilerplate includes a comprehensive database schema:

- **Users** - User accounts and profiles
- **Sessions** - Authentication sessions
- **Accounts** - OAuth provider accounts
- **Products** - Subscription products/plans
- **Subscriptions** - User subscriptions
- **API Keys** - API key management
- **Audit Logs** - Activity tracking

## 🔧 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm db:generate  # Generate database migration
pnpm db:migrate   # Apply database migrations
pnpm db:studio    # Open Drizzle Studio
pnpm db:push      # Push schema changes to database
pnpm db:seed      # Seed database with initial data

# Code Quality
pnpm lint         # Run Biome linter
pnpm format       # Format code with Biome
pnpm check        # Check code with Biome
pnpm fix          # Auto-fix code issues

# Testing
pnpm test         # Run tests
pnpm test:ui      # Run tests with UI
pnpm test:coverage # Generate test coverage

# Admin
pnpm admin        # Admin CLI commands

# Deployment
pnpm deploy       # Deploy to Vercel (production)
pnpm preview      # Deploy to Vercel (preview)

# Setup
./scripts/setup.sh # Automated setup script
pnpm install:all   # Install and setup everything
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables
4. Deploy!

### Other Platforms

The boilerplate is configured for deployment on:
- **Vercel** - Optimized configuration
- **Netlify** - Alternative option
- **Railway** - Full-stack deployment
- **Self-hosted** - Docker support

## 🔐 Authentication

### Better Auth Features

- **Email/Password** - Traditional authentication
- **Magic Links** - Passwordless authentication
- **Social Login** - Google, GitHub integration
- **Password Reset** - Secure password recovery
- **Email Verification** - Account verification
- **Session Management** - Secure session handling

### Protected Routes

```typescript
// Protect admin routes
export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || session.user.role !== 'admin') {
    redirect('/auth/login')
  }

  return <AdminDashboard />
}
```

## 💳 Stripe Integration

### Subscription Management

```typescript
// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: priceId }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
})
```

### Webhook Handling

The boilerplate includes webhook handlers for:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

## 🧪 Testing

Testing is set up with Vitest and React Testing Library:

```typescript
// Example test
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import HomePage from '@/app/page'

test('renders homepage', () => {
  render(<HomePage />)
  expect(screen.getByText('Welcome to SaaS Better')).toBeInTheDocument()
})
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.saasbetter.com](https://docs.saasbetter.com)
- **Discord**: [Join our community](https://discord.gg/saasbetter)
- **Issues**: [GitHub Issues](https://github.com/yourusername/saas-better/issues)
- **Email**: support@saasbetter.com

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Better Auth](https://better-auth.com/) - Modern authentication
- [Stripe](https://stripe.com/) - Payment processing
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe database queries
- [Biome](https://biomejs.dev/) - Fast linting and formatting

---

**Built with ❤️ for the SaaS community**