// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use server'

import {cookies} from 'next/headers'

import {rowsPerPageOptions} from '~/config/pagination'
import {SoftwareLayoutType} from '~/components/search/ToggleViewGroup'

/**
 * New app approach with next/headers cookie module.
 * It extracts users preferences of rsd_page_layout, rsd_page_rows and token from cookies
 */
export async function getUserSettings(){
  const appCookie = await cookies()
  const token = appCookie.get('rsd_token')?.value
  const rsd_page_layout = appCookie.get('rsd_page_layout')?.value as SoftwareLayoutType ?? 'grid' as SoftwareLayoutType
  const rsd_page_rows = appCookie.has('rsd_page_rows') ?
    Number.parseInt(appCookie.get('rsd_page_rows')?.value as string) :
    rowsPerPageOptions[0]

  return {
    rsd_page_layout,
    rsd_page_rows,
    token
  }
}
