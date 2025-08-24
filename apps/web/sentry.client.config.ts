import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN || '',
  enabled: process.env.NODE_ENV !== 'development',
  tracesSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  environment: process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV,
})


