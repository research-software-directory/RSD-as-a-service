// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
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
 * We add nonce to scripts for matomo
 * We use 'unsafe-inline' for style-src to enable css script injections but this can be improved
 * For using nonce with MUI see https://mui.com/material-ui/guides/content-security-policy/
 * Next: https://stackoverflow.com/questions/65551212/using-csp-in-nextjs-nginx-and-material-uissr
 * For other libs injecting css into app further investigation is needed.
 */


// default policies
const sharedPolicy = `
  default-src 'self';
  connect-src 'self' https://*;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*;
  base-uri 'self';
  object-src 'none';
`

export function createNonce(){
  // taken from documentation https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  if (nonce) return nonce
  return '5ef14870-46fd-11ed-b878-0242ac120002'
}

function devScript() {
  if (process.env.NODE_ENV !== 'production') {
    // enable script eval in development
    return '\'unsafe-eval\''
  }
  return ''
}

function stylePolicy(){
  // NOTE! nonce approach does not work on all injected style tags so we use unsafe-inline
  // const styleSrc = `style-src 'self' 'nonce-${nonce}';`
  const styleSrc = 'style-src \'self\' \'unsafe-inline\';'
  return styleSrc
}

function scriptPolicy(nonce:string){
  // all scripts have nonce, except in dev where we need more "freedom"
  const scriptSrc = `script-src 'self' 'nonce-${nonce}' ${devScript()};`
  return scriptSrc
}

/**
 * Build Content Security Policy string from shared, style and script policies.
 * Style policy does not use nonce because we cannot add nonce to all injected style tags.
 * Script policy uses nonce and 'unsafe-eval' in development mode.
 * @param nonce string
 * @returns string
 */
export function getCspPolicy(nonce:string) {
  // combine shared policies with script policy
  const policy = `${sharedPolicy.replace(/\s{2,}/g, ' ').trim()} ${stylePolicy()} ${scriptPolicy(nonce)}`
  // return csp policy
  return policy
}


