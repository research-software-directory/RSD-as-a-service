/** @type {import('next').NextConfig} */

// proxy to localhost when NOT in production mode
const isDevelopment = process.env.NODE_ENV !== 'production'
const rewritesConfig = isDevelopment
  ? [
      {
        source: '/image/:path*',
        destination: 'http://localhost/image/:path*',
    },
    {
        source: '/api/v1/:path*',
        destination: 'http://localhost/api/v1/:path*',
      },
    ]
  : []

module.exports = {
  reactStrictMode: true,
  eslint: {
    // Run ESLint in these directories during production builds (next build)
    // by default next runs linter only in pages/, components/, and lib/
    dirs: ['auth','components','config','pages','styles','types','utils']
  },
  // only in development
  rewrites: async () => rewritesConfig,
}
