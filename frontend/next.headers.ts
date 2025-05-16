// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Security headers based on the feedback from AMC
 * using https://securityheaders.com/
 * and the next.js documentation
 * https://nextjs.org/docs/advanced-features/security-headers
 *
 * Important!
 * These are static security headers applied to all responses
 * This information is generated at build time (not runtime).
 * The security headers which need to be build dynamically, like
 * Content-Security-Policy are handled by utils/contentSecurityPolicy
 * script.
 */

type SecurityHeader={
  key: string,
  value: string
}

// Static headers on each request
export const staticHeaders:SecurityHeader[] = [
  // required by https://securityheaders.com/
  // info at https://scotthelme.co.uk/hsts-the-missing-link-in-tls/
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // we decided to allow embeding
  // required by https://securityheaders.com/
  // https://scotthelme.co.uk/hardening-your-http-response-headers/#x-frame-options
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  // required by https://securityheaders.com/
  // https://scotthelme.co.uk/hardening-your-http-response-headers/#x-frame-options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // required by https://securityheaders.com/
  // https://scotthelme.co.uk/a-new-security-header-referrer-policy/
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  // required by https://securityheaders.com/
  // https://scotthelme.co.uk/a-new-security-header-referrer-policy/
  // used only geolocation, for other values see
  // https://nextjs.org/docs/advanced-features/security-headers#permissions-policy
  {
    key: 'Permissions-Policy',
    value: 'geolocation=(self)'
  },
  // used values from next documentation
  // https://nextjs.org/docs/advanced-features/security-headers#x-dns-prefetch-control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  }
]

export default staticHeaders
