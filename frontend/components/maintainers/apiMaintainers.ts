// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {Invitation, InvitationType} from './InvitationList'

export type RawMaintainerProps = {
  // unique maintainer id
  maintainer: string
  name: string[]
  email: string[]
  affiliation: string[],
  is_primary?: boolean
}

export type MaintainerProps = {
  // unique maintainer id
  account: string
  name: string
  email: string
  affiliation: string,
  // primary maintainer cannot be deleted
  // last maintainer can be deleted only by rsd-admin
  disableDelete?: boolean
}

export function rawMaintainersToMaintainers(raw_maintainers: RawMaintainerProps[]) {
  try {
    const maintainers:MaintainerProps[] = []
    raw_maintainers.forEach(item => {
      let maintainerWithMostInfo: MaintainerProps | null = null
      let bestScore = -1
      // use name as second loop indicator
      item.name.forEach((name, pos) => {
        let score = 0
        if (name) {
          score += 1
        }
        if (item.email[pos]) {
          score += 1
        }
        if (item.affiliation[pos]) {
          score += 1
        }

        if (score <= bestScore) {
          return
        }
        const maintainer: MaintainerProps = {
          account: item.maintainer,
          name,
          email: item.email[pos] ? item.email[pos] : '',
          affiliation: item.affiliation[pos] ? item.affiliation[pos] : '',
          // primary maintainer cannot be deleted
          disableDelete: item?.is_primary ?? false
        }

        maintainerWithMostInfo = maintainer
        bestScore = score
      })
      maintainers.push(maintainerWithMostInfo as unknown as MaintainerProps)
    })
    return maintainers
  } catch (e:any) {
    logger(`rawMaintainersToMaintainers: ${e?.message}`,'error')
    return []
  }
}

export async function deleteMaintainerLink({invitation,token}:{invitation: Invitation,token:string}) {
  try{
    const query = `invite_maintainer_for_${invitation.type}?id=eq.${invitation.id}`
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      headers: createJsonHeaders(token),
      method: 'DELETE'
    })
    return extractReturnMessage(resp)
  }catch(e:any){
    return {
      status:500,
      message: e.message
    }
  }
}

type getUnusedInvitationsProps={
  id: string,
  type: InvitationType
  token?: string
}

export async function getUnusedInvitations({id,type,token}:getUnusedInvitationsProps) {
  try{
    const query = `invite_maintainer_for_${type}?select=id,created_at,expires_at&order=created_at&${type}=eq.${id}&claimed_by=is.null&claimed_at=is.null`

    const url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      headers: createJsonHeaders(token)
    })
    const invitations: Invitation[] = await resp.json()
    invitations.forEach(invitation => {
      invitation.type = type
    })
    return invitations
  }catch(e:any){
    logger(`getUnusedInvitations: ${e?.message}`,'error')
    return []
  }
}
