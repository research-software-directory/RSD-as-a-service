import logger from '~/utils/logger'
import {CrossrefSelectItem} from '~/types/Crossref'
import {WorkResponse} from '~/types/Datacite'
import {
  crossrefItemToMentionItem,
  getCrossrefItemsByTitle
} from '~/utils/getCrossref'
import {
  dataCiteGraphQLItemToMentionItem,
  getDataciteItemsByTitleGraphQL
} from '~/utils/getDataCite'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {MentionItemProps} from '~/types/Mention'
import {addMentionItem} from '~/utils/editMentions'
import {sortBySearchFor} from '~/utils/sortFn'

export async function findPublicationByTitle({software, searchFor, token}:
  { software: string, searchFor: string, token: string }) {
  const promises = [
    getCrossrefItemsByTitle(searchFor),
    getDataciteItemsByTitleGraphQL(searchFor),
    searchForAvailableMentions({
      software,
      searchFor,
      token
    })
  ]
  // make requests
  const [crossref, datacite, rsd] = await Promise.all(promises)
  // convert crossref responses to MentionItems
  const crosrefItems = crossref?.map(item => {
    return crossrefItemToMentionItem(item as CrossrefSelectItem)
  })
  // convert datacite responses to MentionItems
  const dataciteItems = datacite?.map(item => {
    return dataCiteGraphQLItemToMentionItem(item as WorkResponse)
  })
  // change items source to RSD for ones pulled from RSD
  const rsdItems: MentionItemProps[] = rsd.map(item => ({
    ...item as MentionItemProps,
    source: 'RSD'
  }))
  // return results
  const sorted = [
    // RSD items at the top
    ...rsdItems,
    ...crosrefItems,
    ...dataciteItems
  ].sort((a, b) => sortBySearchFor(a, b, 'title', searchFor))
  return sorted
}

/**
 * Searching for items in mention table which are NOT assigned to impact of the project already.
 * @returns MentionItem[]
 */
export async function searchForAvailableMentions({software, searchFor, token}:
  { software: string, searchFor: string, token: string }) {
  const limit=10
  const url = `/api/v1/rpc/search_mentions_for_software?software_id=${software}&search_text=${searchFor}&limit=${limit}`
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
    logger(`searchForAvailableImpact: 404 [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`searchForAvailableImpact: ${e?.message}`, 'error')
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

// export async function updateSoftwareMention({item, software, token}:
//   { item: MentionItemProps, software: string, token: string }) {
//   // make both request
//   const promises = [
//     updateMentionItem({
//       mention: mentionItemToTable(item),
//       token
//     }),
//     updateMentionForSoftware({
//       mention: item.id ?? '',
//       software,
//       is_featured: item.is_featured,
//       token
//     })
//   ]
//   // we just need to update it
//   const responses = await Promise.all(promises)
//   const errors = extractErrorMessages(responses)
//   // return result
//   if (errors.length > 0) {
//     // return first error for now
//     return {
//       status: errors[0].status,
//       message: errors[0].message
//     }
//   }
//   return {
//     status: 200,
//     message: item
//   }
// }


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
