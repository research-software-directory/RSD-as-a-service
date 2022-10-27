// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {TeamMemberProps} from '~/types/Contributor'
import {TeamMember} from '~/types/Project'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {getAvatarUrl} from '~/utils/getProjects'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
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


export async function createTeamMember({data, token}:
  { data: TeamMember, token: string }) {

  const resp = await postTeamMember({
    member: prepareMemberData(data),
    token
  })

  if (resp.status === 201) {
    data.id = resp.message
    const member = removeBase64Data(data)
    return {
      status: 201,
      message: member
    }
  }

  return resp
}

export async function updateTeamMember({data, token}:
  { data: TeamMember, token: string }) {

  const member = prepareMemberData(data)
  const resp = await patchTeamMember({member, token})

  if (resp.status === 200) {
    // if we uploaded new image we remove
    // data and construct avatar_url
    const returned = removeBase64Data(data)
    // reload image to update cache
    if (returned.avatar_url) await fetch(returned.avatar_url, {cache: 'reload'})
    return {
      status: 200,
      message: returned
    }
  } else {
    return resp
  }
}

export function prepareMemberData(data: TeamMember) {
  const member = getPropsFromObject(data, TeamMemberProps)
  // do we need to save new base64 image
  if (data?.avatar_b64 &&
    data?.avatar_b64.length > 10 &&
    data?.avatar_mime_type !== null) {
    // split base64 to use only encoded content
    member.avatar_data = data?.avatar_b64.split(',')[1]
  }
  return member
}

export function removeBase64Data(member: TeamMember) {
  if (member.avatar_b64 &&
    member?.avatar_b64.length > 10) {
    // clean it from memory data
    member.avatar_b64 = null
    // and we use avatar url instead
    member.avatar_url = getAvatarUrl(member)
  }
  return member
}

export async function postTeamMember({member, token}:
  { member: TeamMember, token: string }) {
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
  {member: TeamMember, token: string }) {
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


export async function deleteTeamMemberById({ids, token}: { ids: string[], token: string }) {
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
  { members: TeamMember[], token: string }) {
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
