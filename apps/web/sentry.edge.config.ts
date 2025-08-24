import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || '',
  tracesSampleRate: 1.0,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
})


