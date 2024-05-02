// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdRole} from '~/auth/index'
import logger from '~/utils/logger'

type isCommunityMaintainerProps = {
  community: string
  role?: RsdRole
  account?: string
  token?: string
}

export async function isCommunityMaintainer({community, role, account, token}: isCommunityMaintainerProps) {
  // if no account, token, role provided
  if ( typeof account == 'undefined' ||
    typeof token == 'undefined' ||
    typeof role == 'undefined'
  ) {
    return false
  }

  // if community provided and user role rsd_admin
  if (community && role === 'rsd_admin' && account) {
    return true
  }

  const isMaintainer = await isMaintainerOfCommunity({
    community,
    account,
    token
  })

  return isMaintainer
}

export async function isMaintainerOfCommunity({community, account, token}: isCommunityMaintainerProps) {
  try {
    if ( typeof account == 'undefined' ||
      typeof token == 'undefined'
    ) {
      // if no account, token, role provided
      return false
    }
    console.error('isMaintainerOfCommunity...NOT IMPLEMENTED')
    // const organisations = await getMaintainerOrganisations({
    //   token
    // })
    // // debugger
    // if (organisations.length > 0) {
    //   const isMaintainer = organisations.includes(organisation)
    //   return isMaintainer
    // }
    return false
  } catch (e:any) {
    logger(`isMaintainerOfCommunity: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}
