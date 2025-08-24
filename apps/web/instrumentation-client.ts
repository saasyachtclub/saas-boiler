import { init, replayIntegration, captureRouterTransitionStart } from '@sentry/nextjs'

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Session replay for better debugging
  integrations: [
    replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Session replay sampling
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // Enhanced error tracking
  beforeSend(event, hint) {
    // Filter out development noise
    if (process.env.NODE_ENV === 'development') {
      console.log('Sentry Client Event:', event)
    }
    return event
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || 'development',
  
  // User context
  initialScope: {
    tags: {
      component: 'client',
    },
  },
})

// Export required hooks for Next.js integration
export const onRouterTransitionStart = captureRouterTransitionStart
