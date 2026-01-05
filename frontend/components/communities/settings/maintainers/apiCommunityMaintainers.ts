// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type MaintainerOfCommunity = {
  // unique maintainer id
  maintainer: string
  name: string[]
  email: string[]
  affiliation: string[],
  is_primary?: boolean
}

export async function getMaintainersOfCommunity({community, token}:
{community: string, token: string}) {
  try {
    const query = `rpc/maintainers_of_community?community_id=${community}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: MaintainerOfCommunity[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfCommunity: ${resp.status}:${resp.statusText} community: ${community}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfCommunity: ${e?.message}`, 'error')
    return []
  }
}

export async function deleteMaintainerFromCommunity({maintainer,community,token}:
{maintainer:string,community:string,token:string}) {
  try {
    const query = `maintainer_for_community?maintainer=eq.${maintainer}&community=eq.${community}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`deleteMaintainerFromCommunity: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function communityMaintainerLink({community, account, token}:
{community: string, account: string, token: string}) {
  try {
    // POST
    const url = `${getBaseUrl()}/invite_maintainer_for_community`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        community,
        created_by:account
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/community/${id}`
        return {
          status: 201,
          message: link
        }
      }
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
    return extractReturnMessage(resp, community ?? '')
  } catch (e: any) {
    logger(`communityMaintainerLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
