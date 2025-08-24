import { captureRequestError } from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Server-side Sentry initialization
    const { init } = await import('@sentry/nextjs')
    
    init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      
      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Session replay
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // Enhanced error tracking
      beforeSend(event, hint) {
        // Filter out development errors
        if (process.env.NODE_ENV === 'development') {
          console.log('Sentry Event:', event)
        }
        return event
      },
      
      // Integration configuration
      integrations: [
        // Add any custom integrations here
      ],
      
      // Debug mode for development
      debug: process.env.NODE_ENV === 'development',
      
      // Release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
    })
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    // Edge runtime Sentry initialization
    const { init } = await import('@sentry/nextjs')
    
    init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
    })
  }
}

// Export required hooks for Next.js integration
export const onRequestError = captureRequestError
