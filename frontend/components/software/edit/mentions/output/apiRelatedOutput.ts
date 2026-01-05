// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {MentionItemProps} from '~/types/Mention'
import {addOrGetMentionItem} from '~/components/mention/apiEditMentions'

/**
 * Request to next api to aggreate search from Crossref, Datacite and RSD
 * For Crossref request we defined timeout of 30sec and we use polite request
 * @param param0
 * @returns MentionItemProps[]
 */
export async function findPublicationByTitle({id, searchFor, token}:
{id: string, searchFor: string, token: string}) {
  const query = `id=${id}&search=${encodeURIComponent(searchFor)}&relation_type=software`
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

export async function addNewMentionToSoftware({item, software, token}:
{item: MentionItemProps, software: string, token: string}) {
  // add new item or get existing by DOI
  let resp = await addOrGetMentionItem({
    mention:item,
    token
  })
  // debugger
  if (resp.status === 200) {
    // mention item returned in message
    const mention: MentionItemProps = resp.message
    if (mention.id) {
      resp = await addToMentionForSoftware({
        software,
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
        message: 'Mention id is missing.'
      }
    }
  } else {
    return resp
  }
}

export async function addToMentionForSoftware({mention, software, token}:
{mention: string, software: string, token: string}) {
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
    logger(`addToMentionForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateMentionForSoftware({mention, software, is_featured = false, token}:
{mention: string, software: string, is_featured: boolean, token: string}) {
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
{mention: string, software: string, token: string}) {
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
