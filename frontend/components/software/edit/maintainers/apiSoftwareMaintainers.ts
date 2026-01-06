// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {RawMaintainerProps} from '~/components/maintainers/apiMaintainers'

export async function getMaintainersOfSoftware({software, token}:
{software: string, token: string}) {
  try {
    const query = `rpc/maintainers_of_software?software_id=${software}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json:RawMaintainerProps[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfSoftware: ${resp.status}:${resp.statusText} software: ${software}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function deleteMaintainerFromSoftware({maintainer,software,token}:
{maintainer:string,software:string,token:string}) {
  try {
    const query = `maintainer_for_software?maintainer=eq.${maintainer}&software=eq.${software}`
    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`deleteMaintainerFromSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function softwareMaintainerLink({software, account, token}:
{software: string, account: string, token: string}) {
  try {
    // POST
    const url = `${getBaseUrl()}/invite_maintainer_for_software`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        software,
        created_by:account
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/software/${id}`
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
    return extractReturnMessage(resp, software ?? '')
  } catch (e: any) {
    logger(`softwareMaintainerLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
