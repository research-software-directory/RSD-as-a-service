// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
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
let sharedPolicy = `
  default-src 'self';
  style-src 'self' 'unsafe-inline';
  connect-src 'self' https://*;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*;
`
// default script def
let sharedScript = 'script-src \'self\''

function defaultNonce() {
  if (crypto) return crypto.randomUUID()
  return '5ef14870-46fd-11ed-b878-0242ac120002'
}

function monitoringScripts() {
  if (process.env.MATOMO_URL) {
    return process.env.MATOMO_URL
  }
  return ''
}

function devScript() {
  if (process.env.NODE_ENV !== 'production') {
    // enable script eval in development
    return '\'unsafe-eval\''
  }
  return ''
}

export function nonceContentSecurity() {
  const nonce = crypto.randomUUID()
  // append default, monitoring scripts and dev script
  let scriptSrc = `${sharedScript} ${monitoringScripts()} ${devScript()} 'nonce-${nonce}'`
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

/*
 * SHA content security approach IS NOT USED. It seems that nonce approach is
 * supported by MUI and can also be applied to injected scripts in _document.tsx.
 * I decided to use nonce approach only because it is sufficient and simpler.
 * 2022-10-08 Dusan
 */

// type ShaContentSecurityProps = {
//   // source code as string
//   source: string,
//   // create nonce and provide the value for the refference
//   withNonce?: boolean
// }
// export function shaContentSecurity({source, withNonce = true}: ShaContentSecurityProps) {
//   // create hash
//   const hash = hashSourceCode(source)
//   let nonce
//   // append default, monitoring scripts and dev script
//   let scriptSrc = `${sharedScript} ${monitoringScripts()} ${devScript()} ${hash}`
//   // add nonce
//   if (withNonce) {
//     nonce = crypto.randomUUID()
//     scriptSrc += ` 'nonce-${nonce}'`
//   }
//   // combine shared policies with dynamic script policy
//   const policy = `${sharedPolicy.replace(/\s{2,}/g, ' ').trim()} ${scriptSrc}`
//   // console.log('shaContentSecurity...', policy)
//   return {
//     policy,
//     nonce
//   }
// }

// // Create sha256 hash from the source code
// function hashSourceCode(src: string) {
//   if (src) {
//     const hash = crypto
//       .createHash('sha256')
//       .update(src)
//       .digest('base64')

//     return `'sha256-${hash}'`
//   }
//   return ''
// }

