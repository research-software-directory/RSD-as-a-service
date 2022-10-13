// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {MentionItemProps} from '~/types/Mention'
import {addOrGetMentionItem} from '~/utils/editMentions'

export async function findPublicationByTitle({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const query = `id=${project}&search=${encodeURIComponent(searchFor)}`
  const url = `/api/fe/mention/impact?${query}`
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    // debugger
    if (resp.status === 200) {
      const json: MentionItemProps[] = await resp.json()
      return json
    }
    logger(`findPublicationByTitle: ${resp.status} ${resp.statusText} [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`findPublicationByTitle: ${e?.message}`, 'error')
    return []
  }
}

export async function addImpactItem({item, project, token}: { item: MentionItemProps, project: string, token: string }) {
  let mention: MentionItemProps
  // new item not in rsd
  if (item.id === null) {
    // add mention item to RSD
    const resp = await addOrGetMentionItem({
      mention: item,
      token
    })
    if (resp.status !== 200) {
      // exit
      return {
        status: resp.status,
        message: `Failed to add ${item.title}. ${resp.message}`
      }
    }
    // assign created mention item
    mention = resp.message
  } else {
    // use existing RSD item
    mention = item
  }
  // add mention item to impact table
  if (mention && mention.id) {
    const resp = await addImpactToProject({
      project,
      mention: mention.id,
      token
    })
    if (resp.status !== 200) {
      return {
        status: resp.status,
        message: `Failed to add ${item.title}. ${resp.message}`
      }
    } else {
      // return mention in message
      return {
        status: 200,
        message: mention
      }
    }
  }
  return {
    status: 500,
    message: 'Failed to save item'
  }
}

export async function addImpactToProject({mention, project, token}: { mention: string, project: string, token: string }) {
  const url = '/api/v1/impact_for_project'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        project,
        mention
      })
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`addImpactToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function removeImpactForProject({mention, project, token}:
  { mention: string, project: string, token: string }) {
  const url = `/api/v1/impact_for_project?project=eq.${project}&mention=eq.${mention}`
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`removeImpactForProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
