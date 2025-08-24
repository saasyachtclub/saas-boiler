# Claude Code Configuration

## SaaS Better - Next.js 15 Boilerplate

This is a comprehensive SaaS boilerplate built with modern technologies. Use this configuration to understand the project structure and development guidelines.

## Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # User dashboard
│   │   ├── (admin)/           # Admin panel
│   │   ├── (marketing)/       # Marketing pages
│   │   ├── api/               # API routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── admin/            # Admin components
│   │   ├── auth/             # Auth components
│   │   ├── dashboard/        # Dashboard components
│   │   └── marketing/        # Marketing components
│   ├── lib/                  # Utility libraries
│   │   ├── auth/             # Better Auth config
│   │   ├── db/               # Drizzle ORM config
│   │   ├── schemas/          # Zod validation
│   │   ├── stripe/           # Stripe integration
│   │   ├── email/            # Resend email config
│   │   ├── credits/          # Credits system
│   │   └── organizations/    # Org management
│   ├── hooks/                # Custom React hooks
│   ├── stores/               # Zustand stores
│   └── types/                # TypeScript types
```

## Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict configuration
- **Database**: Drizzle ORM + Neon PostgreSQL
- **Authentication**: Better Auth with role-based access
- **Payments**: Stripe with credits system
- **Email**: Resend for transactional emails
- **Styling**: Tailwind CSS + shadcn/ui + Magic UI
- **Linting**: Biome
- **Testing**: Playwright + Vitest
- **Deployment**: Vercel

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate migrations
pnpm db:migrate       # Apply migrations
pnpm db:studio        # Open Drizzle Studio

# Admin
pnpm admin            # Admin CLI commands

# Testing
pnpm test             # Run tests
pnpm test:e2e         # Run E2E tests
```

## Environment Variables

Required environment variables are documented in `.env.example`:

```env
# Database
DATABASE_URL="postgresql://..."

# Better Auth
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="..."
STRIPE_WEBHOOK_SECRET="..."

# Resend Email
RESEND_API_KEY="..."
FROM_EMAIL="noreply@saasbetter.com"
```

## Code Style

- Use functional React components with hooks
- Implement proper TypeScript types
- Use server components when possible
- Follow the established file structure
- Use proper error handling
- Implement loading and error states
- Use proper accessibility practices

## Database Schema

The application uses Drizzle ORM with the following key tables:

- `users` - User accounts and authentication
- `organizations` - Multi-tenant organization support
- `organization_members` - Organization membership
- `organization_invitations` - Organization invites
- `subscriptions` - Stripe subscription management
- `products` - Subscription products/plans
- `api_keys` - API key management
- `audit_logs` - Activity tracking

## Authentication

- **Better Auth** handles all authentication
- **Role-based access control** with user/admin/super_admin
- **Protected routes** using Next.js middleware
- **Session management** with secure cookies

## API Routes

- All API routes use proper error handling
- Zod validation for request/response data
- Rate limiting implemented
- Proper CORS configuration
- RESTful conventions followed

## Testing Strategy

- **Vitest** for unit and integration tests
- **Playwright** for E2E testing
- **Component testing** with React Testing Library
- **Visual regression testing** with Playwright

## Deployment

- **Vercel** for frontend deployment
- **Neon** for database hosting
- **GitHub Actions** for CI/CD
- **Environment variables** managed through Vercel

## Security Features

- Rate limiting on all API routes
- CORS properly configured
- Content Security Policy headers
- HTTPS enforcement
- Input sanitization
- SQL injection protection via Drizzle

## Performance Optimizations

- Next.js Image optimization
- Code splitting and lazy loading
- Proper caching strategies
- Database query optimization
- Bundle analysis and monitoring

## Browser Automation

- **Browser-use** integration for web automation
- **Playwright** for testing and automation
- **Proper error handling** and logging
- **Security measures** in place

## Credits System

- **Token-based credits** for API usage
- **Stripe integration** for purchasing credits
- **Usage tracking** and analytics
- **Rate limiting** based on credit balance
- **Automatic credit deduction** on API calls
