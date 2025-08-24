# 🚀 Deployment Guide

Deploy your SaaS Yacht Club application to production with confidence. This guide covers multiple deployment options and best practices for a successful launch.

## 🎯 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] **Environment variables** configured for production
- [ ] **Database** set up and accessible
- [ ] **Stripe** webhooks configured
- [ ] **Domain name** ready (optional)
- [ ] **SSL certificate** (handled by most platforms)
- [ ] **Email service** configured
- [ ] **Analytics** and monitoring set up

## 🌟 Vercel (Recommended)

Vercel is the easiest and most optimized platform for Next.js applications.

### Step 1: Prepare Your Repository

```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/in with your GitHub account
3. Click "New Project"
4. Import your `saas-boiler` repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or `apps/web` if using monorepo)
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`

### Step 3: Environment Variables

Add these environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://...

# Authentication
BETTER_AUTH_SECRET=your-production-secret
BETTER_AUTH_URL=https://yourdomain.com

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
RESEND_API_KEY=re_...

# Analytics (Optional)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://...
AXIOM_TOKEN=xaat-...

# Redis (Optional)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Visit your deployed application
4. Test all functionality

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `BETTER_AUTH_URL` environment variable

## 🐳 Docker Deployment

Deploy using Docker for maximum flexibility and control.

### Dockerfile

Create a `Dockerfile` in your project root:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN corepack enable pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
      - STRIPE_WEBHOOK_SECRET=${STRIPE_WEBHOOK_SECRET}
      - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}
      - RESEND_API_KEY=${RESEND_API_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: saas_yacht_club
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Deploy with Docker

```bash
# Build and run
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## ☁️ Railway

Railway offers a simple deployment experience with built-in PostgreSQL.

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login and Initialize

```bash
railway login
railway init
```

### Step 3: Add Services

```bash
# Add PostgreSQL database
railway add postgresql

# Deploy your application
railway up
```

### Step 4: Configure Environment

```bash
# Set environment variables
railway variables set BETTER_AUTH_SECRET=your-secret
railway variables set STRIPE_SECRET_KEY=sk_live_...
# ... add all other variables
```

## 🌊 DigitalOcean App Platform

Deploy to DigitalOcean's managed platform.

### Step 1: Create App

1. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect your GitHub repository
4. Configure build settings:
   - **Source Directory**: `/`
   - **Build Command**: `pnpm build`
   - **Run Command**: `pnpm start`

### Step 2: Add Database

1. Add a PostgreSQL database component
2. Note the connection details
3. Update your environment variables

### Step 3: Environment Variables

Add all required environment variables in the app settings.

### Step 4: Deploy

Click "Create Resources" to deploy your application.

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Database (Use connection pooling in production)
DATABASE_URL=postgresql://user:pass@host:port/db?sslmode=require&pgbouncer=true

# Authentication (Use strong secrets)
BETTER_AUTH_SECRET=your-super-secure-secret-key
BETTER_AUTH_URL=https://yourdomain.com

# Stripe (Use live keys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Email
RESEND_API_KEY=re_...

# Security
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=another-secure-secret

# Analytics & Monitoring
NEXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://...
AXIOM_TOKEN=xaat-...

# Redis (For caching and sessions)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

## 🔒 Security Considerations

### SSL/TLS

- Always use HTTPS in production
- Most platforms handle SSL certificates automatically
- For custom deployments, use Let's Encrypt

### Environment Variables

- Never commit secrets to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Use strong, random values

### Database Security

- Use connection pooling (PgBouncer)
- Enable SSL connections
- Restrict database access by IP
- Regular backups and monitoring

### Headers and CSP

The application includes security headers by default:

```javascript
// next.config.js includes security headers
{
  key: 'X-Frame-Options',
  value: 'DENY',
},
{
  key: 'X-Content-Type-Options',
  value: 'nosniff',
},
{
  key: 'Referrer-Policy',
  value: 'strict-origin-when-cross-origin',
}
```

## 📊 Monitoring and Analytics

### Error Tracking

- **Sentry** is configured for error tracking
- Monitor error rates and performance
- Set up alerts for critical issues

### Performance Monitoring

- Use Vercel Analytics or similar
- Monitor Core Web Vitals
- Track user experience metrics

### Business Analytics

- **PostHog** for product analytics
- Track user behavior and conversions
- A/B test new features

## 🔄 CI/CD Pipeline

### GitHub Actions

The repository includes GitHub Actions workflows:

- **CI**: Runs tests and linting on every PR
- **Deploy**: Automatic deployment on main branch
- **Security**: Dependency scanning and security checks

### Deployment Strategy

1. **Development**: Feature branches with preview deployments
2. **Staging**: Main branch deploys to staging environment
3. **Production**: Tagged releases deploy to production

## 🚨 Troubleshooting

### Common Deployment Issues

**Build Failures**
```bash
# Check build logs for specific errors
# Common issues: missing environment variables, dependency conflicts

# Solution: Ensure all dependencies are in package.json
pnpm install --frozen-lockfile
```

**Database Connection Issues**
```bash
# Check DATABASE_URL format
# Ensure database is accessible from deployment platform
# Verify SSL requirements
```

**Environment Variable Issues**
```bash
# Ensure all required variables are set
# Check for typos in variable names
# Verify values are correct for production
```

### Performance Issues

- Enable caching (Redis)
- Optimize images and assets
- Use CDN for static files
- Monitor database query performance

## 📈 Post-Deployment

### Health Checks

Set up monitoring for:
- Application uptime
- Database connectivity
- API response times
- Error rates

### Backup Strategy

- Database backups (daily/weekly)
- File storage backups
- Configuration backups
- Disaster recovery plan

### Scaling

- Monitor resource usage
- Set up auto-scaling if available
- Consider database read replicas
- Implement caching strategies

## 🎉 Success!

Your SaaS Yacht Club application is now live in production! 🚀

### Next Steps

1. **Monitor** your application performance
2. **Set up** alerts and notifications
3. **Test** all functionality in production
4. **Configure** custom domain and SSL
5. **Launch** your marketing campaigns

Need help? Join our [Discord community](https://discord.gg/saasyachtclub) or check our [documentation](https://docs.saasyachtclub.com).

Happy sailing! ⚓
