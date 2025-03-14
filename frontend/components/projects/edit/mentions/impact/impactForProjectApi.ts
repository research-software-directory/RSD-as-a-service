// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {MentionItemProps} from '~/types/Mention'
import {addOrGetMentionItem} from '~/utils/editMentions'

export async function findPublicationByTitle({id, searchFor, token}:
  { id: string, searchFor: string, token: string }) {
  const query = `id=${id}&search=${encodeURIComponent(searchFor)}&relation_type=impact`
  const url = `/api/fe/mention/find_by_title?${query}`
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

export async function addNewImpactToProject({item, project, token}:
  { item: MentionItemProps, project: string, token: string }) {
  // add new item or get existing by DOI
  let resp = await addOrGetMentionItem({
    mention: item,
    token
  })
  // debugger
  if (resp.status === 200) {
    // mention item returned in message
    const mention: MentionItemProps = resp.message
    if (mention.id) {
      resp = await addToImpactForProject({
        project,
        mention: mention.id,
        token
      })
      if (resp.status === 200) {
        // we return mention item in message
        return {
          status: 200,
          message: mention
        }
      } else {
        return resp
      }
    } else {
      return {
        status: 500,
        message: 'Mention id missing.'
      }
    }
  } else {
    return resp
  }
}

export async function addToImpactForProject({mention, project, token}: { mention: string, project: string, token: string }) {
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
