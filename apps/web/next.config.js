/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  experimental: {
    appDir: true,
  },
  serverExternalPackages: ['@neondatabase/serverless'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Auth-Token',
          },
        ],
      },
    ]
  },
  productionBrowserSourceMaps: true,
}

const sentryWebpackPluginOptions = {
  org: process.env.SENTRY_ORG || 'saasyachtclub',
  project: process.env.SENTRY_PROJECT || 'saas-boiler',
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  telemetry: false,
}

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions)
