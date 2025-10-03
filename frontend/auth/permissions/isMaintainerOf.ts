// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {isMaintainerOfSoftware} from './isMaintainerOfSoftware'
import {isMaintainerOfProject} from './isMaintainerOfProject'

export type isMaintainerProps = {
  slug: string,
  account?: string,
  token: string,
  pageType: 'software' | 'project'
}

let isMaintainer = false
let lastSlug = ''
let lastAccount = ''
let lastPageType = ''
let lastToken = ''

export async function isMaintainerOf({slug, account, token, pageType}: isMaintainerProps) {
  try {
    if (typeof account == 'undefined') return false
    if (slug === '') return false
    if (token === '') return false

    if (lastSlug === slug &&
      lastAccount === account &&
      lastPageType === pageType &&
      lastToken === token
    ) {
      // return last value for this user?
      // console.log('isMaintainerOf...(cached)...', isMaintainer)
      return isMaintainer
    }

    switch (pageType) {
      case 'project':
        isMaintainer = await isMaintainerOfProject({
          slug,
          account,
          token
        })
        break
      default:
        // software is default for now
        isMaintainer = await isMaintainerOfSoftware({
          slug,
          account,
          token
        })
    }
    // update last values
    lastSlug = slug
    lastAccount = account
    lastPageType = pageType
    lastToken = token
    // debugger
    return isMaintainer
  } catch (e: any) {
    logger(`isMaintainerOf error ${e?.message}`, 'error')
    return false
  }
}
