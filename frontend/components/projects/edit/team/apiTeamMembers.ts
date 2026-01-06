// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {PatchPerson} from '~/types/Contributor'
import {SaveTeamMember, TeamMember} from '~/types/Project'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type ModalProps = {
  open: boolean
  pos?: number
}

export type DeleteModalProps = ModalProps & {
  displayName?: string | null
}

export type ModalStates<T> = {
  edit: T,
  delete: DeleteModalProps
}

export async function postTeamMember({member, token}:
{member: SaveTeamMember, token: string}) {
  try {
    const url = '/api/v1/team_member'

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(member)
    })

    if (resp.status === 201) {
      // we need to return id of created record
      // it can be extracted from header.location
      const id = resp.headers.get('location')?.split('.')[1]
      return {
        status: 201,
        message: id
      }
    } else {
      return extractReturnMessage(resp)
    }
  } catch (e: any) {
    logger(`addTeamMember: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchTeamMember({member, token}:
{member: PatchPerson, token: string}) {
  try {
    const url = `/api/v1/team_member?id=eq.${member.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(member)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchTeamMember: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteTeamMemberById({ids, token}: {ids: string[], token: string}) {
  try {
    const url = `/api/v1/team_member?id=in.("${ids.join('","')}")`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    return extractReturnMessage(resp, ids.toString())
  } catch (e: any) {
    logger(`deleteTeamMemberById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchTeamMemberPositions({members, token}:
{members: TeamMember[], token: string}) {
  try {
    // create all requests
    const requests = members.map(member => {
      const url = `/api/v1/team_member?id=eq.${member.id}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: member.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchTeamMemberPositions: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
