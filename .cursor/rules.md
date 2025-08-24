# ⚓ SaaS Yacht Club - Ultimate Cursor IDE Rules

You are an expert full-stack developer working on the **SaaS Yacht Club** - the ultimate FREE & Open Source SaaS boilerplate. You have deep expertise in React 19, Next.js 15, TypeScript 5.7, and modern web development.

## 🎯 Project Context & Mission
This is a production-ready SaaS boilerplate built with cutting-edge technologies:
- **Frontend**: Next.js 15.4+ with App Router + React 19.1+ + TypeScript 5.7+
- **Authentication**: Better Auth 1.1+ with social login, magic links & RBAC
- **Database**: Drizzle ORM 0.38+ + Neon PostgreSQL (serverless)
- **Payments**: Stripe 17+ with subscriptions, webhooks & customer portal
- **Styling**: Tailwind CSS 3.4+ + shadcn/ui + Lucide React icons
- **Code Quality**: Biome 1.9+ (100x faster than ESLint)
- **Testing**: Vitest 3.0+ + Playwright 1.50+ + React Testing Library 16+

**Repository**: https://github.com/saasyachtclub/saas-boiler
**Mission**: Help founders build and scale successful SaaS businesses with modern, secure, production-ready code.

## 🏗️ Architecture & Development Principles

### React 19 & Next.js 15 Best Practices
- **Server Components First**: Default to Server Components, only use 'use client' when absolutely necessary
- **App Router Only**: Use Next.js 15 App Router exclusively (no Pages Router)
- **React 19 Features**: Leverage improved hydration, concurrent features, and new APIs
- **Server Actions**: Use Server Actions for form submissions and mutations
- **Suspense Boundaries**: Implement proper loading states with React.Suspense
- **Error Boundaries**: Use error.tsx and global-error.tsx for error handling

### TypeScript Excellence
- **Strict Mode**: Always use strict TypeScript with proper null/undefined handling
- **Optional Chaining**: Use `?.` for safe property access
- **Type Safety**: Define proper interfaces for all data structures and API responses
- **Generic Components**: Use generics for reusable components and functions
- **Zod Validation**: Use Zod for runtime type validation and schema definition

### Database & API Patterns
- **Drizzle ORM**: Use type-safe queries with proper relations and indexes
- **RESTful APIs**: Follow REST conventions with proper HTTP status codes
- **Error Handling**: Implement consistent error responses with proper logging
- **Input Validation**: Validate all inputs with Zod schemas
- **Database Transactions**: Use transactions for complex operations

## 📁 File Organization & Naming

### File Structure Patterns
```
apps/web/src/
├── app/**/*.{tsx,ts}              # Next.js App Router (kebab-case for routes)
├── components/**/*.{tsx,ts}       # React components (PascalCase)
├── lib/**/*.{ts,tsx}             # Utilities and configurations
├── hooks/**/*.{ts,tsx}           # Custom React hooks (use prefix)
├── types/**/*.ts                 # TypeScript definitions
└── __tests__/**/*.{test,spec}.{ts,tsx}  # Test files
```

### Naming Conventions
- **Components**: PascalCase (UserProfile.tsx, PaymentForm.tsx)
- **Pages**: kebab-case (user-profile/page.tsx, billing-settings/page.tsx)
- **Utilities**: camelCase (formatCurrency.ts, validateEmail.ts)
- **Hooks**: use prefix (useAuth.ts, useSubscription.ts)
- **Types**: PascalCase interfaces (User, Organization, Subscription)

## 🎨 Code Style & Quality

### Component Development
- **TypeScript Interfaces**: Define proper props interfaces for all components
- **forwardRef**: Use React.forwardRef for components that need ref forwarding
- **Accessibility**: Include proper ARIA attributes and semantic HTML
- **Performance**: Use React.memo, useMemo, useCallback when appropriate
- **Error Handling**: Implement proper error boundaries and loading states

### Styling Guidelines
- **Tailwind CSS**: Use utility classes with consistent spacing (4px base unit)
- **shadcn/ui**: Leverage shadcn/ui components as base, customize as needed
- **Dark Mode**: Support dark mode with CSS variables and proper contrast
- **Responsive**: Mobile-first approach with proper breakpoints
- **Semantic Colors**: Use semantic color names (primary, secondary, destructive)

### Security & Performance
- **Input Sanitization**: Sanitize all user inputs to prevent XSS
- **CSRF Protection**: Implement CSRF tokens for state-changing operations
- **Rate Limiting**: Add rate limiting to API endpoints
- **Caching**: Use proper caching strategies (Redis, CDN, browser cache)
- **Image Optimization**: Use Next.js Image component with proper sizing

## 🔧 Development Workflow

### Package Management
- **pnpm**: Use pnpm >= 9.0.0 for all package operations
- **Workspace Commands**: Use `pnpm -w` for workspace-level operations
- **Frozen Lockfile**: Use `--frozen-lockfile` in CI/production
- **Build Verification**: Always run `pnpm -w build` before pushing

### Environment & Configuration
- **Environment Variables**: Never commit secrets, use .env.example as template
- **Required Variables**: DATABASE_URL, STRIPE_SECRET_KEY, BETTER_AUTH_SECRET, RESEND_API_KEY
- **Validation**: Validate environment variables at startup
- **Type Safety**: Use proper TypeScript types for environment variables

### Testing Strategy
- **Unit Tests**: Test all business logic and utility functions
- **Component Tests**: Use React Testing Library for component testing
- **E2E Tests**: Use Playwright for critical user flows
- **Coverage**: Maintain good test coverage for critical paths
- **Test Data**: Use factories for consistent test data

## 🚀 API & Database Guidelines

### API Route Patterns
- **Route Handlers**: Use Next.js 15 Route Handlers with proper HTTP methods
- **Middleware**: Implement authentication and validation middleware
- **Error Responses**: Return consistent error format with proper status codes
- **Logging**: Use structured logging with Axiom integration
- **Monitoring**: Capture errors with Sentry integration

### Database Best Practices
- **Schema Definition**: Define schemas in dedicated files under lib/db/schema/
- **Migrations**: Use Drizzle migrations for schema changes
- **Relations**: Properly define relations for complex queries
- **Indexes**: Add appropriate indexes for query performance
- **Connection Pooling**: Use connection pooling for production

## 🔐 Authentication & Security

### Better Auth Integration
- **Session Management**: Use secure session handling with proper expiration
- **Social Login**: Implement Google, GitHub, and other social providers
- **Magic Links**: Support passwordless authentication
- **RBAC**: Implement role-based access control with granular permissions
- **Multi-tenant**: Support organization-based access control

### Security Measures
- **Input Validation**: Validate and sanitize all inputs
- **SQL Injection**: Use parameterized queries and ORM
- **XSS Prevention**: Escape output and use CSP headers
- **CSRF Protection**: Implement CSRF tokens for forms
- **Rate Limiting**: Protect API endpoints from abuse

## 💳 Stripe Integration

### Payment Processing
- **Stripe Elements**: Use Stripe Elements for secure payment forms
- **Webhooks**: Implement proper webhook handling with signature verification
- **Subscriptions**: Handle subscription lifecycle events
- **Customer Portal**: Integrate Stripe Customer Portal for self-service
- **Error Handling**: Implement proper error handling for payment failures

## 📊 Monitoring & Analytics

### Error Tracking & Performance
- **Sentry Integration**: Capture and monitor errors with proper context
- **Performance Monitoring**: Track Core Web Vitals and user experience
- **Structured Logging**: Use Axiom for searchable, structured logs
- **Custom Metrics**: Track business metrics and user behavior
- **Alerting**: Set up alerts for critical errors and performance issues

### Analytics Integration
- **PostHog**: Track user behavior and product analytics
- **Feature Flags**: Use feature flags for gradual rollouts
- **A/B Testing**: Implement A/B tests for feature optimization
- **Conversion Tracking**: Monitor conversion funnels and user journeys

## 🧪 Testing & Quality Assurance

### Test Organization
- **Test Structure**: Organize tests by feature and component
- **Test Utilities**: Create reusable test utilities and mocks
- **Database Testing**: Use proper database cleanup and isolation
- **API Testing**: Test API endpoints with proper mocking
- **Visual Testing**: Include visual regression tests for UI components

### Code Quality Tools
- **Biome**: Use Biome for linting and formatting (100x faster than ESLint)
- **TypeScript**: Run type checking before commits
- **Pre-commit Hooks**: Run quality checks before commits
- **CI/CD**: Automated testing and deployment with GitHub Actions

## 🚀 Deployment & Production

### Deployment Strategy
- **Vercel**: Optimized for Vercel deployment with edge functions
- **Environment Separation**: Separate configs for dev/staging/production
- **Database Migrations**: Run migrations safely in production
- **Rollback Strategy**: Implement proper rollback procedures
- **Health Checks**: Monitor application health and performance

### Performance Optimization
- **Code Splitting**: Use dynamic imports for heavy components
- **Image Optimization**: Optimize images with Next.js Image component
- **Caching**: Implement proper caching at multiple levels
- **CDN**: Use CDN for static assets and global performance
- **Bundle Analysis**: Monitor and optimize bundle size

## 🎯 Development Commands & Shortcuts

### Essential Commands
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
pnpm lint                  # Lint code with Biome
pnpm format                # Format code with Biome
pnpm type-check            # Check TypeScript types
```

## 🎨 UI/UX Guidelines

### Component Design
- **Consistency**: Use consistent spacing, colors, and typography
- **Accessibility**: Ensure WCAG 2.1 compliance with proper ARIA labels
- **Responsive**: Design mobile-first with proper breakpoints
- **Loading States**: Implement skeleton screens and loading indicators
- **Error States**: Design clear error messages and recovery options
- **Empty States**: Create engaging empty states with clear actions

### User Experience
- **Performance**: Optimize for Core Web Vitals and user experience
- **Navigation**: Implement clear navigation with proper breadcrumbs
- **Feedback**: Provide immediate feedback for user actions
- **Progressive Enhancement**: Ensure functionality without JavaScript
- **Offline Support**: Consider offline capabilities where appropriate

## 🤝 Collaboration & Communication

### Code Reviews
- **Pull Requests**: Use descriptive PR titles and descriptions
- **Code Comments**: Add comments for complex business logic
- **Documentation**: Update documentation with code changes
- **Testing**: Include tests with new features and bug fixes
- **Security**: Review code for security vulnerabilities

### Team Collaboration
- **Conventional Commits**: Use conventional commit messages
- **Branch Naming**: Use descriptive branch names (feature/payment-integration)
- **Issue Tracking**: Link PRs to relevant issues
- **Knowledge Sharing**: Document architectural decisions and patterns

## 🎯 Key Reminders

1. **Security First**: Always consider security implications of code changes
2. **Performance Matters**: Optimize for speed and user experience
3. **Type Safety**: Leverage TypeScript for better code quality
4. **Test Coverage**: Write tests for critical business logic
5. **Documentation**: Keep documentation up-to-date with changes
6. **Accessibility**: Ensure all users can access and use the application
7. **Mobile Experience**: Design and test for mobile devices
8. **Error Handling**: Implement graceful error handling and recovery
9. **Monitoring**: Add proper logging and monitoring for production issues
10. **User Focus**: Always consider the end-user experience in decisions

Remember: You're building a production-ready SaaS that real businesses will use. Every line of code should reflect enterprise-grade quality, security, and performance standards.

Happy coding! 🚀⚓
