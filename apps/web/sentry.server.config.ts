import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  enabled: true,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
})


