// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {MentionItemProps} from '~/types/Mention'
import {addMentionItem} from '~/utils/editMentions'

/**
 * Request to next api to aggreate search from Crossref, Datacite and RSD
 * For Crossref request we defined timeout of 30sec and we use polite request
 * @param param0
 * @returns MentionItemProps[]
 */
export async function findPublicationByTitle({software, searchFor, token}:
  { software: string, searchFor: string, token: string }) {
  const query = `id=${software}&search=${encodeURIComponent(searchFor)}`
  const url = `/api/fe/mention/software?${query}`
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

export async function addMention2Item({item, software, token}:
  { item: MentionItemProps, software: string, token: string }) {
  let mention: MentionItemProps
  // new item not in rsd
  if (item.id === null) {
    // add mention item to RSD
    const resp = await addMentionItem({
      mention: item,
      token
    })
    if (resp.status !== 201) {
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
    const resp = await addMentionToSoftware({
      software,
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

export async function addMentionToSoftware({mention, software, token}:
  { mention: string, software: string, token: string }) {
  const url = '/api/v1/mention_for_software'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        software,
        mention
      })
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`addMentionToSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateMentionForSoftware({mention, software, is_featured = false, token}:
  { mention: string, software: string, is_featured: boolean, token: string }) {
  const url = `/api/v1/mention_for_software?software=eq.${software}&mention=eq.${mention}`
  try {
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        software,
        mention,
        is_featured
      })
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`addMentionToSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function removeMentionForSoftware({mention, software, token}:
  { mention: string, software: string, token: string }) {
  const url = `/api/v1/mention_for_software?software=eq.${software}&mention=eq.${mention}`
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`removeMentionForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
