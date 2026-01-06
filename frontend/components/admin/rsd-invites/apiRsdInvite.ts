// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type NewAccountInvite = {
  // null means unlimited number of users
  uses_left: number | null
  comment: string | null
  // data formatted YYYY-MM-DD
  expires_at: string
}

export type AccountInvite = NewAccountInvite & {
  id: string,
  created_at: string
  updated_at?: string
}

export async function getRsdInvites({token}: {token: string}) {
  try {
    const query = 'order=expires_at'
    const url = `${getBaseUrl()}/account_invite?${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: AccountInvite[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getRsdInvites: ${resp.status}:${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getRsdInvites: ${e?.message}`, 'error')
    return []
  }
}

export async function createRsdInvite({invite, token}: {invite: NewAccountInvite, token: string}) {
  try {
    // POST
    const url = `${getBaseUrl()}/account_invite`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(invite)
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/rsd/${id}`
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
    return extractReturnMessage(resp, 'invite')

  } catch (e: any) {
    logger(`createRsdInvite: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteRsdInvite({id, token}: {id: string, token: string}) {
  try {
    const query = `id=eq.${id}`
    const url = `${getBaseUrl()}/account_invite?${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deleteRsdInvite: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
