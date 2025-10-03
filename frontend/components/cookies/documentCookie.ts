// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {parse} from 'cookie'
import logger from '~/utils/logger'
/**
 * Set document cookie.
 * Frontend ONLY!
 * @param value
 * @param name
 * @param path
 */
export function setDocumentCookie(value: string, name: string, path: string = '/') {
  try {
    // match matomo cookie expiration time of 400 days
    const maxAgeInSeconds = 60 * 60 * 24 * (400)
    document.cookie = `${name}=${value};path=${path};SameSite=Lax;Secure;Max-Age=${maxAgeInSeconds};`
  } catch (e: any) {
    logger(`setCookie error: ${e.message}`, 'error')
  }
}

/**
 * Extract cookie from document/page.
 * Frontend ONLY!
 * @param name
 * @param defaultValue
 * @returns
 */

export function getDocumentCookie(name: string, defaultValue: any) {
  if (typeof document === 'undefined') {
    // console.log('getDocumentCookie...node...defaultValue...', defaultValue)
    return defaultValue
  }
  if (document.cookie) {
    const cookies = parse(document.cookie)
    if (cookies.hasOwnProperty(name)) {
      return cookies[name]
    }
    return defaultValue
  }
  return defaultValue
}
