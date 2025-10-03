// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import {parse} from 'cookie'
import {rowsPerPageOptions} from '~/config/pagination'
import {SoftwareLayoutType} from '~/components/search/ToggleViewGroup'

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
      rsd_page_layout: cookies?.rsd_page_layout as SoftwareLayoutType ?? 'grid' as SoftwareLayoutType,
      rsd_page_rows: cookies?.rsd_page_rows ? Number.parseInt(cookies?.rsd_page_rows) : rowsPerPageOptions[0],
      avatar_id: null
    }
  } else {
    return {
      rsd_page_layout: 'grid' as SoftwareLayoutType,
      rsd_page_rows: rowsPerPageOptions[0],
      avatar_id: null
    }
  }
}

