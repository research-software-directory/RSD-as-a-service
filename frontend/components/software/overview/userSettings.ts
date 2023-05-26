// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import cookie from 'cookie'
import logger from '~/utils/logger'
import {rowsPerPageOptions} from '~/config/pagination'

/**
 * Extract user settings cookies
 * Available only on the server side, using plain Node request
 * @param req
 * @returns Session
 */
export function getUserSettings(req: IncomingMessage) {
  // check for cookies
  if (req?.headers?.cookie) {
    // parse cookies from node request
    const cookies = cookie.parse(req.headers.cookie)
    // validate and decode
    return {
      rsd_page_layout: cookies?.rsd_page_layout ?? 'masonry',
      rsd_page_rows: parseInt(cookies?.rsd_page_rows ?? rowsPerPageOptions[0])
    }
  } else {
    return {
      rsd_page_layout: 'masonry',
      rsd_page_rows: rowsPerPageOptions[0]
    }
  }
}

/**
 * Set document cookie.
 * Frontend ONLY!
 * @param value
 * @param name
 * @param path
 */
export function setDocumentCookie(value: string, name: string, path: string = '/') {
  try {
    // match matomo cookie exiration time of 400 days
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

export function getDocumentCookie(name: string, defaultValue:any) {
  if (document && document.cookie) {
    const cookies = cookie.parse(document.cookie)
    if (cookies.hasOwnProperty(name)) {
      return cookies[name]
    }
    return defaultValue
  }
  return defaultValue
}
