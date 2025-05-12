// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import {parse} from 'cookie'
import logger from '~/utils/logger'
import {rowsPerPageOptions} from '~/config/pagination'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'

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
    const cookies = parse(req.headers.cookie)
    // validate and decode
    return {
      rsd_page_layout: cookies?.rsd_page_layout as LayoutType ?? 'grid' as LayoutType,
      rsd_page_rows: cookies?.rsd_page_rows ? parseInt(cookies?.rsd_page_rows) : rowsPerPageOptions[0]
    }
  } else {
    return {
      rsd_page_layout: 'grid' as LayoutType,
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
