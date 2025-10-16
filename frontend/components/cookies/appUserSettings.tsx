// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {cookies} from 'next/headers'
import {rowsPerPageOptions} from '~/config/pagination'
import {getUserAvatar} from '~/components/user/getUserAvatar'
import {SoftwareLayoutType} from '../search/ToggleViewGroup'

export async function appUserSettings({account,token}:{account?:string,token?:string}){
  // get cookies and avatar
  const [cookie, avatar_id]= await Promise.all([
    cookies(),
    getUserAvatar(account,token),
  ])

  // user preferences from cookies
  const page_layout = cookie.get('rsd_page_layout')?.value
  const page_rows = cookie.get('rsd_page_rows')?.value

  // console.log('page_layout...',JSON.stringify(page_layout))
  // console.log('page_rows...',page_rows)

  return {
    rsd_page_layout: page_layout as SoftwareLayoutType ?? 'grid' as SoftwareLayoutType,
    rsd_page_rows: page_rows ? Number.parseInt(page_rows) : rowsPerPageOptions[0],
    avatar_id
  }
}
