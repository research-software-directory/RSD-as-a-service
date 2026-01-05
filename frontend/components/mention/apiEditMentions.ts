// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {
  MentionByType, MentionItemProps,
  mentionColumns, MentionTypeKeys
} from '~/types/Mention'
import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'

export async function getMentionsForSoftware({software,token}:{software: string, token?: string}) {
  try {
    // the content is ordered by type ascending
    // Try changing 'mention' to one of the following: 'mention!mention_for_software', 'mention!reference_paper_for_software'. Find the desired relationship in the 'details' key.
    const query = `software?id=eq.${software}&select=id,slug,mention!mention_for_software(${mentionColumns})&mention.order=mention_type.asc`
    // construct url
    const url = `${getBaseUrl()}/${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request single object item
        'Accept': 'application/vnd.pgrst.object+json'
      }
    })
    if (resp.status === 200) {
      const json = await resp.json()
      // extract mentions from software object
      const mentions: MentionItemProps[] = json?.mention ?? []
      return mentions
    }
    logger(`getMentionsForSoftware: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getMentionsForSoftware: ${e?.message}`, 'error')
    return []
  }
}


export async function getMentionByDoiFromRsd({doi,token}:{doi: string, token: string}) {
  try {
    // we need to encode DOI because it supports "exotic" values
    const url = `/api/v1/mention?select=${mentionColumns}&doi=eq.${encodeURIComponent(doi)}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200) {
      const json = await resp.json()
      return {
        status: 200,
        message: json
      }
    }
    return extractReturnMessage(resp)
  } catch (e:any) {
    logger(`getMentionByDoiFromRsd: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function getMentionByOpenalexIdFromRsd({id,token}:{id: string, token: string}) {
  try {
    // we need to encode the OpenAlex ID because it is a full URL
    const url = `/api/v1/mention?select=${mentionColumns}&openalex_id=eq.${encodeURIComponent(id)}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200) {
      const json = await resp.json()
      return {
        status: 200,
        message: json
      }
    }
    return extractReturnMessage(resp)
  } catch (e:any) {
    logger(`getMentionByOpenalexIdFromRsd: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function getMentionsByDoiFromRsd({dois,token}:{dois: string[], token: string}) {
  try {
    const doisJoined: string = dois
      .map(doi => encodeURIComponent(doi))
      .map(encodedDoi => `doi.eq.%22${encodedDoi}%22`)
      .join(',')
    // we need to encode DOI because it supports "exotic" values
    const url = `/api/v1/mention?select=${mentionColumns}&or=(${doisJoined})`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200) {
      const json = await resp.json()
      return {
        status: 200,
        message: json
      }
    }
    return extractReturnMessage(resp)
  } catch (e:any) {
    logger(`getDoiFromRsd: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export function classifyMentionsByType(mentions: MentionItemProps[]) {
  const mentionByType: MentionByType = {}
  const featuredMentions: MentionItemProps[] = []

  mentions.forEach(item => {// NOSONAR
    // remove array with software uuid
    // delete item.mention_for_software
    // check if type prop exists
    const mType = item?.mention_type as MentionTypeKeys ?? 'other'

    // extract featured mentions/highlight
    if (item.mention_type === 'highlight') {
      featuredMentions.push(item)
    } else if (mentionByType.hasOwnProperty(mType)) {
      mentionByType[mType]?.push(item)
    } else {
      // create array for new type
      mentionByType[mType]=[]
      // and add this item
      mentionByType[mType]?.push(item)
    }
  })
  return {
    mentionByType,
    featuredMentions
  }
}

/**
 * Add new mention item to mention table if not found
 * otherwise return the existing item
 * @returns MentionItem
 */
export async function addOrGetMentionItem({mention, token}:
{mention: MentionItemProps, token: string}) {
  const url = '/api/v1/mention'
  try {
    // check if publication is already
    // imported to RSD by DOI
    if (mention.doi) {
      // console.group('addOrGetMentionItem')
      // console.log('doi...', mention.doi)
      // addOrGetMentionItem
      const found = await getMentionByDoiFromRsd({
        doi: mention.doi,
        token
      })
      // console.log('found...', found)
      // console.groupEnd()
      // if publication found in RSD
      if (found.status === 200 &&
        found.message.length === 1) {
        // we return that entry
        return {
          status: 200,
          message: found.message[0]
        }
      }
    }
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(mention)
    })

    if (resp.status === 201) {
      const json: MentionItemProps[] = await resp.json()
      // take item from array response
      return {
        status: 200,
        message: json[0]
      }
    }
    logger(`upsertMentionItem: ${resp.status} ${resp.statusText}`, 'error')
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`upsertMentionItem: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

/**
 * RSD admin role can update mention item.
 * RSD user role is only able to remove mention item,
 * if not referenced somewhere else and replace it
 * with new item. To user this will "look-like" an update action
 * but only in situations when item is linked only to users item.
 * @param param0
 * @returns
 */
export async function replaceMentionItem({mention,token}:
{mention: MentionItemProps, token: string}){
  try {
    let resp
    if (mention.id) {
      // rsd_user can only delete (if not referenced somewhere else)
      // delete first
      resp = await deleteMentionItem({
        id: mention.id,
        token
      })
      if (resp.status === 200) {
        // add new item
        resp = await addOrGetMentionItem({
          mention,
          token
        })
        return resp
      } else if (resp.status === 409) {
        return {
          status: 409,
          message: 'Cannot update mention item because it is referenced in other software or projects. Only RSD administrator can update this item. Please contact RSD support.'
        }
      } else {
        return resp
      }
    } else {
      return {
        status: 400,
        message: 'Mention id is missing.'
      }
    }
  } catch (e:any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

/**
 * Update existing mention item in mention table
 * @returns MentionItem
 */
export async function updateMentionItem({mention, token}:
{mention: MentionItemProps, token: string}) {
  if (!mention.id) {
    return {
      status: 400,
      message: 'Mention id missing'
    }
  }
  const url = `/api/v1/mention?id=eq.${mention.id}`
  try {
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(mention)
    })

    if ([200,204].includes(resp.status)) {
      // return item in message
      return {
        status: 200,
        message: mention
      }
    }
    logger(`updateMentionItem: ${resp.status} ${resp.statusText}`, 'error')
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`updateMentionItem: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export function newMentionItem(title?: string) {
  const newItem: MentionItemProps = {
    id: null,
    doi: null,
    url: null,
    title: title ?? null,
    authors: null,
    publisher: null,
    publication_year: null,
    journal: null,
    page: null,
    // url to external image
    image_url: null,
    mention_type: null,
    source: 'manual',
    note: null
  }
  return newItem
}

/**
 * delete existing mention item in the mention table
 */
export async function deleteMentionItem({id, token}:
{id: string, token: string}) {

  const url = `/api/v1/mention?id=eq.${id}`
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if ([200, 204].includes(resp.status) === true) {
      // return item in message
      return {
        status: 200,
        message: id
      }
    } else if (resp.status === 409) {
      // we ignore 409 on delete because
      // we try to delete mention item that might be
      // referenced in multiple software/projects
      logger(`deleteMentionItem: ${resp.status} ${resp.statusText}`, 'info')
      return extractReturnMessage(resp)
    }
    logger(`deleteMentionItem: ${resp.status} ${resp.statusText}`, 'error')
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deleteMentionItem: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

/**
 * Get manually added mentions and automatically scraped citations provided by reference papers
 * @param param0
 * @returns MentionItemProps[]
 */
export async function getMentionsBySoftware({software,token}:{software: string, token?: string}) {
  try {
    // the content is ordered by type ascending
    const query = `software=eq.${software}&order=mention_type.asc`
    // construct url
    const url = `${getBaseUrl()}/rpc/mentions_by_software?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.status === 200) {
      const json = await resp.json()
      // extract mentions from software object
      const mentions: MentionItemProps[] = json ?? []
      return mentions
    }
    logger(`getMentionsBySoftware: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getMentionsBySoftware: ${e?.message}`, 'error')
    return []
  }
}
