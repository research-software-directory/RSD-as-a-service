import {MentionByType} from '../components/software/MentionsByType'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {MentionItem, MentionForSoftware} from '../types/MentionType'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import logger from './logger'

export async function getMentionsForSoftware({software,token,frontend}:{software: string, token?: string,frontend?:boolean}) {
  try {
    // the content is order by type ascending
    const cols ='id,date,is_featured,title,type,url,image,author'
    let url = `${process.env.POSTGREST_URL}/mention?select=${cols},mention_for_software!inner(software)&mention_for_software.software=eq.${software}&order=type.asc`

    if (frontend) {
      url = `/api/v1/mention?select=${cols},mention_for_software!inner(software)&mention_for_software.software=eq.${software}&order=type.asc`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: MentionForSoftware[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getMentionsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return undefined
    }
  } catch (e: any) {
    logger(`getMentionsForSoftware: ${e?.message}`, 'error')
    return undefined
  }
}

export async function getMentionsForSoftwareOfType({software, type, token, frontend}:
  { software: string, type:string, token?: string, frontend?: boolean }) {
  try {

    const cols = 'id,date,is_featured,title,type,url,image,author'
    let url = `${process.env.POSTGREST_URL}/mention?select=${cols},mention_for_software!inner(software)&mention_for_software.software=eq.${software}&type=eq.${type}&order=title.asc`

    if (frontend) {
      url = `/api/v1/mention?select=${cols},mention_for_software!inner(software)&mention_for_software.software=eq.${software}&type=eq.${type}&order=title.asc`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: MentionForSoftware[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getMentionsForSoftwareOfType: 404 [${url}]`, 'error')
      // query not found
      return []
    }
  } catch (e: any) {
    logger(`getMentionsForSoftwareOfType: ${e?.message}`, 'error')
    return []
  }
}


/**
 * Searching for mentions in mention table which are NOT assigned to this software already.
 * @returns MentionItem[]
 */
export async function searchForAvailableMentions({software, searchFor, token}:
  {software:string, searchFor: string, token: string }) {
  const url ='/api/v1/rpc/search_mentions_for_software'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        software_id: software,
        search_text: searchFor
      })
    })

    if (resp.status === 200) {
      const json:MentionItem[] = await resp.json()
      return json
    } else {
      logger(`searchForAvailableMentions: 404 [${url}]`, 'error')
      return []
    }
  } catch (e:any) {
    logger(`searchForAvailableMentions: ${e?.message}`, 'error')
    return []
  }
}

export async function addMentionToSoftware({mention, software, token}: { mention: string, software: string, token: string }) {
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

  } catch (e:any) {
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

export function mentionsToAutocompleteOptions(mentions: MentionItem[]) {
  const options:AutocompleteOption<MentionItem>[] = mentions.map((item, pos) => {
    return {
      key: item.zotero_key ?? '',
      label: item.title,
      data: {
        ...item,
        pos
      }
    }
  })
  return options
}

export function clasifyMentionsByType(mentions: MentionForSoftware[]) {
  let mentionByType: MentionByType = {}
  let featuredMentions: MentionForSoftware[] = []

  mentions.forEach(item => {
    // remove array with software uuid
    delete item.mention_for_software
    // check if type prop exists
    let mType = item?.type as string ?? 'default'
    // extract featured mentions
    if (item.is_featured === true) {
      mType = 'featured'
      featuredMentions.push(item)
    } else if (mentionByType?.hasOwnProperty(item.type)) {
      mentionByType[mType].push(item)
    } else {
      // create array for new type
      mentionByType[mType] = []
      // and add this item
      mentionByType[mType].push(item)
    }
  })
  return {
    mentionByType,
    featuredMentions
  }
}
