import * as Sentry from '@sentry/nextjs'
import { log as axiomLog, withAxiom } from 'next-axiom'

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogContext {
  [key: string]: unknown
}

export function log(level: LogLevel, message: string, context?: LogContext) {
  try {
    axiomLog[level](message, context)
  } catch { }

  const payload = context ? { message, ...context } : { message }
  switch (level) {
    case 'error':
      console.error(payload)
      break
    case 'warn':
      console.warn(payload)
      break
    case 'info':
      console.info(payload)
      break
    default:
      console.log(payload)
  }
}

export function captureError(error: unknown, context?: LogContext) {
  try {
    Sentry.captureException(error, { extra: context })
  } catch { }

  log('error', error instanceof Error ? error.message : 'Unknown error', {
    error,
    ...context,
  })
}

export { withAxiom }


