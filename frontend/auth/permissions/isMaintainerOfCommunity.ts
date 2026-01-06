// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdRole} from '~/auth/index'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
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

async function isMaintainerOfCommunity({community, account, token}: isCommunityMaintainerProps) {
  try {
    if ( typeof account == 'undefined' ||
      typeof token == 'undefined'
    ) {
      // if no account, token, role provided
      return false
    }
    const communities = await getCommunitiesOfMaintainer({
      token
    })
    // console.log('isMaintainerOfCommunity...',communities)
    // debugger
    if (communities.length > 0) {
      const isMaintainer = communities.includes(community)
      return isMaintainer
    }
    return false
  } catch (e:any) {
    logger(`isMaintainerOfCommunity: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}

export async function getCommunitiesOfMaintainer({token}:
{token?: string}) {
  try {
    // without token api request is not needed
    if (!token) return []
    // build url
    const query = 'rpc/communities_of_current_maintainer'
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const json:string[] = await resp.json()
      return json
    }
    // ERRORS AS NOT MAINTAINER
    logger(`getCommunitiesOfMaintainer: ${resp.status}:${resp.statusText}`, 'warn')
    return []
  } catch(e:any) {
    // ERRORS AS NOT MAINTAINER
    logger(`getCommunitiesOfMaintainer: ${e.message}`, 'error')
    return []
  }
}
