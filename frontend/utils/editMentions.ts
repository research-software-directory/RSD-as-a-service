// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// import {MentionByType} from '../components/software/MentionsByType'
import {
  MentionByType,
  MentionItemProps, MentionForSoftware,
  MentionForProject, mentionColumns, MentionTypeKeys
} from '../types/Mention'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import {extractMentionFromDoi} from './getDOI'
import logger from './logger'

export async function getMentionsForSoftware({software,token,frontend}:{software: string, token?: string,frontend?:boolean}) {
  try {
    // the content is order by type ascending
    const query = `mention?select=${mentionColumns},mention_for_software!inner(software)&mention_for_software.software=eq.${software}&order=mention_type.asc`
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: MentionForSoftware[] = await resp.json()
      return data
    }
    logger(`getMentionsForSoftware: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getMentionsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

// export async function getMentionsForSoftwareOfType({software, type, token, frontend}:
//   { software: string, type:string, token?: string, frontend?: boolean }) {
//   try {
//     const query = `mention?select=${mentionColumns},mention_for_software!inner(software)&mention_for_software.software=eq.${software}&type=eq.${type}&order=title.asc`
//     let url = `${process.env.POSTGREST_URL}/${query}`

//     if (frontend) {
//       url = `/api/v1/${query}`
//     }

//     const resp = await fetch(url, {
//       method: 'GET',
//       headers: createJsonHeaders(token)
//     })
//     if (resp.status === 200) {
//       const data: MentionForSoftware[] = await resp.json()
//       return data
//     }
//     logger(`getMentionsForSoftwareOfType: 404 [${url}]`, 'error')
//     // query not found
//     return []
//   } catch (e: any) {
//     logger(`getMentionsForSoftwareOfType: ${e?.message}`, 'error')
//     return []
//   }
// }

/**
 * Searching for mentions in mention table which are NOT assigned to this software already.
 * @returns MentionItem[]
 */
// export async function searchForAvailableMentions({software, searchFor, token}:
//   {software:string, searchFor: string, token: string }) {
//   const url ='/api/v1/rpc/search_mentions_for_software'
//   try {
//     const resp = await fetch(url, {
//       method: 'POST',
//       headers: createJsonHeaders(token),
//       body: JSON.stringify({
//         software_id: software,
//         search_text: searchFor
//       })
//     })

//     if (resp.status === 200) {
//       const json: MentionItemProps[] = await resp.json()
//       return json
//     } else {
//       logger(`searchForAvailableMentions: 404 [${url}]`, 'error')
//       return []
//     }
//   } catch (e:any) {
//     logger(`searchForAvailableMentions: ${e?.message}`, 'error')
//     return []
//   }
// }

// export async function addMentionToSoftware({mention, software, token}: { mention: string, software: string, token: string }) {
//   const url = '/api/v1/mention_for_software'
//   try {
//     const resp = await fetch(url, {
//       method: 'POST',
//       headers: createJsonHeaders(token),
//       body: JSON.stringify({
//         software,
//         mention
//       })
//     })

//     return extractReturnMessage(resp, mention)

//   } catch (e:any) {
//     logger(`addMentionToSoftware: ${e?.message}`, 'error')
//     return {
//       status: 500,
//       message: e?.message
//     }
//   }
// }

// export async function removeMentionForSoftware({mention, software, token}:
//   { mention: string, software: string, token: string }) {
//   const url = `/api/v1/mention_for_software?software=eq.${software}&mention=eq.${mention}`
//   try {
//     const resp = await fetch(url, {
//       method: 'DELETE',
//       headers: createJsonHeaders(token)
//     })

//     return extractReturnMessage(resp, mention)

//   } catch (e: any) {
//     logger(`removeMentionForSoftware: ${e?.message}`, 'error')
//     return {
//       status: 500,
//       message: e?.message
//     }
//   }
// }

// TODO! remove this function later
// export function mentionsToAutocompleteOptions(mentions: MentionItemProps[]) {
//   const options: AutocompleteOption<MentionItemProps>[] = mentions.map((item, pos) => {
//     return {
//       key: item.doi ?? Math.random().toString(),
//       label: item.title ?? '',
//       data: {
//         ...item,
//         pos
//       }
//     }
//   })
//   return options
// }

export function clasifyMentionsByType(mentions: MentionForSoftware[]|MentionForProject[]) {
  let mentionByType: MentionByType = {}
  let featuredMentions: MentionForSoftware[] | MentionForProject[] = []

  mentions.forEach(item => {
    // remove array with software uuid
    // delete item.mention_for_software
    // check if type prop exists
    let mType = item?.mention_type as MentionTypeKeys ?? 'other'

    // extract featured mentions
    if (item.is_featured === true) {
      // mType = 'featured'
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

export function mentionsByType(mentions: MentionItemProps[]) {
  let mentionByType: MentionByType = {}
  mentions.forEach(item => {
    // remove array with software uuid
    // delete item.mention_for_software
    // check if type prop exists
    let mType = item?.mention_type as MentionTypeKeys ?? 'other'

    // extract featured mentions
    if (mentionByType.hasOwnProperty(mType)) {
      mentionByType[mType]?.push(item)
    } else {
      // create array for new type
      mentionByType[mType] = []
      // and add this item
      mentionByType[mType]?.push(item)
    }
  })
  return mentionByType
}

/**
 * Add new mention item to mention table
 * @returns MentionItem
 */
export async function addMentionItem({mention, token}:
  { mention: MentionItemProps, token: string }) {
  const url = '/api/v1/mention'
  try {
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
        status: 201,
        message: json[0]
      }
    }
    logger(`addMentionItem: ${resp.status} ${resp.statusText}`, 'error')
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`addMentionItem: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}


/**
 * Update existing mention item in mention table
 * @returns MentionItem
 */
export async function updateMentionItem({mention, token}:
  { mention: MentionItemProps, token: string }) {
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

    if ([200,204].includes(resp.status)===true) {
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

export async function updateDoiItem({rsdItem, token}:
  { rsdItem: MentionItemProps, token: string }) {
  if (!rsdItem || rsdItem.id === null) return {
    status: 400,
    message: 'Failed to update item. Missing payload'
  }
  // extract doi
  const doi = rsdItem.doi
  if (doi) {
    let resp = await extractMentionFromDoi(doi)
    // if error return it
    if (resp.status !== 200) return resp
    // extract item from message
    const doiItem: MentionItemProps = resp.message
    // copy to RSD specific values from old item
    doiItem.id = rsdItem.id
    doiItem.is_featured = rsdItem.is_featured
    doiItem.image_url = rsdItem.image_url
    // update mention in RSD
    resp = await updateMentionItem({
      mention: doiItem,
      token
    })
    // return error
    if (resp.status !== 200) return resp
    // return updated item as message
    resp.message = doiItem
    return resp
  }
  // return error message
  return {
    status: 400,
    message: `Invalid DOI: ${doi}`
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
    page: null,
    // url to external image
    image_url: null,
    is_featured: false,
    mention_type: null,
    source: 'manual'
  }
  return newItem
}


export function apiMentionTypeToRSDTypeKey(type: string): MentionTypeKeys {
  switch (type.toLowerCase()) {
    case 'blog-post':
      return 'blogPost'
    case 'book-set':
    case 'book-series':
    case 'book-track':
    case 'book':
      return 'book'
    case 'book-part':
    case 'book-chapter':
    case 'book-section':
    case 'book chapter':
      return 'bookSection'
    case 'conference-paper':
      return 'conferencePaper'
    case 'dataset':
      return 'dataset'
    case 'interview':
      return 'interview'
    case 'journal':
    case 'journal-article':
    case 'journal-volume':
    case 'journal-issue':
    case 'journal article':
      return 'journalArticle'
    case 'magazine-article':
      return 'magazineArticle'
    case 'newspaper-article':
      return 'newspaperArticle'
    case 'presentation':
      return 'presentation'
    case 'report-series':
    case 'report':
      return 'report'
    case 'software':
    case 'computer-program':
      return 'computerProgram'
    case 'thesis':
      return 'thesis'
    case 'video-recording':
      return 'videoRecording'
    case 'webpage':
      return 'webpage'
    default:
      return 'other'
  }
}


