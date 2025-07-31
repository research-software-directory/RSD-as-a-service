// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// default policies
export const sharedPolicy = `
  default-src 'self';
  connect-src 'self' https://*;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https://*;
  base-uri 'self';
  object-src 'none';
`

export function createNonce(){
  return '5ef14870-46fd-11ed-b878-0242ac120002'
}

export function monitoringScripts() {
  if (process.env.MATOMO_URL) {
    return ` ${process.env.MATOMO_URL}`
  }
  return ''
}

export function devScript() {
  if (process.env.NODE_ENV !== 'production') {
    // enable script eval in development
    return '\'unsafe-eval\''
  }
  return ''
}

export function stylePolicy(){
  // NOTE! nonce approach does not work on all injected style tags so we use unsafe-inline
  // const styleSrc = `style-src 'self' 'nonce-${nonce}';`
  const styleSrc = 'style-src \'self\' \'unsafe-inline\';'
  return styleSrc
}

export function scriptPolicy(nonce:string){
  // let scriptSrc = `script-src 'self' 'strict-dynamic'${monitoringScripts()} ${devScript()} 'unsafe-inline'`
  // script policy allows unsafe inline?
  const scriptSrc = `script-src 'self' 'nonce-${nonce}' ${devScript()};`
  return scriptSrc
}

/**
 * App specific function
 * cannot be contentSecurityPolicy file because of import crypto
 * @param nonce
 * @returns
 */
export function getCspPolicy(nonce:string) {
  // combine shared policies with script policy
  const policy = `${sharedPolicy.replace(/\s{2,}/g, ' ').trim()} ${stylePolicy()} ${scriptPolicy(nonce)}`
  // return csp policy
  return policy
}

export function getNonce(headers?: Record<string, string | string[] | undefined>) {
  let nonce:string

  // get existing nonce from header x-nonce (middleware.ts)
  if (headers) {
    nonce = headers['x-nonce'] as string
    return nonce
  }
  // get existing nonce from meta tag (_document.tsx/layout.tsx)
  if (typeof document !== 'undefined') {
    const nonceMeta = document.querySelector('meta[name="csp-nonce"]')
    if (typeof nonceMeta?.getAttribute('content')==='string') {
      nonce = nonceMeta?.getAttribute('content') as string
      return nonce
    }
  }
  // create new nonce
  nonce = createNonce()
  return nonce
}

