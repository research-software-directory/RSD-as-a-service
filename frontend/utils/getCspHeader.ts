// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// default policies
export const sharedPolicy = `
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://*;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*;
  base-uri 'none';
  object-src 'none';
`
export function monitoringScripts() {
  if (process.env.MATOMO_URL) {
    return ` ${process.env.MATOMO_URL}`
  }
  return ''
}

export function devScript() {
  if (process.env.NODE_ENV !== 'production') {
    // enable script eval in development
    return ' \'unsafe-eval\''
  }
  return ''
}

/**
 * App specific function
 * cannot be contentSecurityPolicy file because of import crypto
 * @param nonce
 * @returns
 */
export function getCspHeader(nonce:string) {
  // append default, monitoring scripts and dev script
  const scriptSrc = `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${monitoringScripts()} ${devScript()} 'unsafe-inline' https://*;`
  // let scriptSrc = `script-src 'self' 'strict-dynamic'${monitoringScripts()} ${devScript()} 'unsafe-inline'`
  // combine shared policies with script policy
  const policy = `${sharedPolicy.replace(/\s{2,}/g, ' ').trim()} ${scriptSrc}`
  // return csp policy
  return policy
}
