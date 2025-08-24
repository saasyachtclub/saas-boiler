# 🚀 Quick Start Guide

Get your SaaS Yacht Club boilerplate up and running in minutes! This guide will walk you through the essential steps to get started with your new SaaS application.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 20+** installed
- **pnpm 9+** package manager
- **Git** for version control
- A **PostgreSQL database** (we recommend [Neon](https://neon.tech/))
- A **Stripe account** for payments
- A **Resend account** for emails

## ⚡ 5-Minute Setup

### 1. Clone the Repository

```bash
git clone https://github.com/saasyachtclub/saas-boiler.git
cd saas-boiler
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

Copy the environment template:

```bash
cp .env.example .env.local
```

Update your `.env.local` file with your credentials:

```env
# Database (Required)
DATABASE_URL="postgresql://username:password@host:port/database"

# Authentication (Required)
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Stripe (Required for payments)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Email (Required)
RESEND_API_KEY="re_..."

# Optional Services
NEXT_PUBLIC_POSTHOG_KEY="phc_..."
SENTRY_DSN="https://..."
AXIOM_TOKEN="xaat-..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
```

### 4. Database Setup

Push the database schema:

```bash
pnpm db:push
```

Optionally, seed with sample data:

```bash
pnpm db:seed
```

### 5. Start Development Server

```bash
pnpm dev
```

🎉 **That's it!** Your SaaS is now running at [http://localhost:3000](http://localhost:3000)

## 🎯 What's Next?

### Explore the Features

1. **Sign up** for a new account
2. **Create an organization** and invite team members
3. **Set up billing** with Stripe integration
4. **Customize** the UI to match your brand
5. **Deploy** to production

### Key Pages to Visit

- **Landing Page**: `/` - Your marketing homepage
- **Dashboard**: `/dashboard` - User dashboard after login
- **Admin Panel**: `/admin` - Admin interface (admin role required)
- **Pricing**: `/pricing` - Subscription plans
- **Settings**: `/dashboard/settings` - User and organization settings

### Development Commands

```bash
# Development
pnpm dev                    # Start development server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm db:push               # Push schema changes
pnpm db:studio             # Open Drizzle Studio
pnpm db:migrate            # Run migrations
pnpm db:seed               # Seed database

# Testing
pnpm test                  # Run unit tests
pnpm test:e2e              # Run E2E tests
pnpm test:coverage         # Test with coverage

# Code Quality
pnpm lint                  # Lint code
pnpm format                # Format code
pnpm type-check            # Check TypeScript
```

## 🔧 Customization

### Branding

1. **Logo**: Replace files in `/public/`
2. **Colors**: Update `tailwind.config.js`
3. **Fonts**: Modify font imports in `layout.tsx`
4. **Metadata**: Update SEO data in `layout.tsx`

### Features

1. **Add Pages**: Create new routes in `src/app/`
2. **Components**: Build reusable components in `src/components/`
3. **Database**: Extend schema in `src/lib/db/schema.ts`
4. **API Routes**: Add endpoints in `src/app/api/`

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy automatically

### Other Platforms

- **Netlify**: Works with minor config changes
- **Railway**: Great for full-stack apps
- **DigitalOcean**: App Platform deployment
- **Docker**: Containerized deployment

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check your DATABASE_URL format
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=require"
```

**Build Errors**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
pnpm install
pnpm build
```

**Environment Variables**
```bash
# Make sure all required variables are set
# Check .env.example for the complete list
```

### Getting Help

- 📚 **Documentation**: [docs.saasyachtclub.com](https://docs.saasyachtclub.com)
- 💬 **Discord**: [Join our community](https://discord.gg/saasyachtclub)
- 🐛 **Issues**: [GitHub Issues](https://github.com/saasyachtclub/saas-boiler/issues)
- 📧 **Email**: [hello@saasyachtclub.com](mailto:hello@saasyachtclub.com)

## 🎉 Success!

You now have a fully functional SaaS application with:

- ✅ **Authentication** system with social login
- ✅ **Payment processing** with Stripe
- ✅ **Multi-tenant** architecture
- ✅ **Email system** with templates
- ✅ **Admin dashboard** for management
- ✅ **Modern UI** with dark mode
- ✅ **Database** with type-safe ORM
- ✅ **Testing** suite ready to use

Ready to build the next big SaaS? Let's set sail! ⚓🚀
