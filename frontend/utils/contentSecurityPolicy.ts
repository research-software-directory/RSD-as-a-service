// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Security headers based on the feedback from AMC
 * using https://securityheaders.com/
 * and the next.js documentation
 * https://nextjs.org/docs/advanced-features/security-headers
 *
 * Content-Security-Policy need to be build dynamically
 * This meta info is added in _document.tsx and _app.tsx
 *
 * Important!
 * We use 'nonce' for the script tags running in _document.tsx
 * We allow direct connection to scripts for matomo based on MATOMO_URL environment variable
 * We use 'unsafe-inline' for style-src to enable css script injections but this can be improved
 * For using nonce with MUI see https://mui.com/material-ui/guides/content-security-policy/
 * Next: https://stackoverflow.com/questions/65551212/using-csp-in-nextjs-nginx-and-material-uissr
 * For other libs injecting css into app further investigation is needed.
 */

import crypto from 'crypto'
import {IncomingMessage, ServerResponse} from 'http'

// default policies
const sharedPolicy = `
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://*;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*;
  base-uri 'none';
  object-src 'none';
`
// default script def - use unsafe-inline for backward compatibility
// https://developer.chrome.com/docs/lighthouse/best-practices/csp-xss/?utm_source=lighthouse&utm_medium=devtools#ensure-csp-is-backwards-compatible
// const sharedScript = 'script-src \'self\' '

function defaultNonce() {
  if (crypto) return crypto.randomUUID()
  return '5ef14870-46fd-11ed-b878-0242ac120002'
}

function monitoringScripts() {
  if (process.env.MATOMO_URL) {
    return ` ${process.env.MATOMO_URL}`
  }
  return ''
}

function devScript() {
  if (process.env.NODE_ENV !== 'production') {
    // enable script eval in development
    return ' \'unsafe-eval\''
  }
  return ''
}

export function nonceContentSecurity() {
  const nonce = crypto.randomUUID()
  // append default, monitoring scripts and dev script
  const scriptSrc = `script-src 'nonce-${nonce}' 'strict-dynamic'${monitoringScripts()}${devScript()} 'unsafe-inline' https:`
  // combine shared policies with script policy
  const policy = `${sharedPolicy.replace(/\s{2,}/g, ' ').trim()} ${scriptSrc}`
  // console.log('shaContentSecurity...', policy)
  return {
    policy,
    nonce
  }
}

// RUNS only on server side as it needs server response object to append response header
export function setContentSecurityPolicyHeader(res?: ServerResponse<IncomingMessage>) {
  // if server response object is not present returns default nonce value
  if (!res) return defaultNonce()
  // get policy to use and nonce to return
  const {policy, nonce} = nonceContentSecurity()
  // append to response header
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Content-Security-Policy', policy)
  } else {
    // report only in development
    res.setHeader('Content-Security-Policy-Report-Only', policy)
  }
  // return nonce
  return nonce
}
