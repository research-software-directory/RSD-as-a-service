// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {MentionItemProps, mentionColumns} from '~/types/Mention'
import {addOrGetMentionItem} from '~/utils/editMentions'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {CitationItemProps} from './CitationItem'

export async function addToReferencePaperForSoftware({mention, software, token}:
  { mention: string, software: string, token: string }) {
  const url = '/api/v1/reference_paper_for_software'
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
    logger(`addToReferencePaperForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addNewReferencePaperToSoftware({item, software, token}:
  { item: MentionItemProps, software: string, token: string }) {
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
      resp = await addToReferencePaperForSoftware({
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
        message: 'Reference paper id is missing.'
      }
    }
  } else {
    return resp
  }
}

export async function removeReferencePaperForSoftware({mention, software, token}:
  { mention: string, software: string, token: string }) {
  const url = `/api/v1/reference_paper_for_software?software=eq.${software}&mention=eq.${mention}`
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`removeReferencePaperForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getReferencePapersForSoftware({software,token}:{software: string, token?: string}) {
  try {
    // the content is ordered by type ascending
    const query = `software?id=eq.${software}&select=id,slug,mention!reference_paper_for_software(${mentionColumns})&mention.order=publication_year.desc,mention_type.asc`
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
    logger(`getReferencePapersForSoftware: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getReferencePapersForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export type CitationState={
  count: number,
  citations: CitationItemProps[]
}


type GetCitationsForSoftwareProps={
  software: string,
  token?: string
  search?: string | null
  page?:number | null,
  rows?:number | null
}

export async function getCitationsForSoftware({
  software,token,search,page,rows}:GetCitationsForSoftwareProps
):Promise<CitationState> {
  try {
    // the content is ordered by type ascending
    const offset = (page ?? 0) * (rows ?? 12)
    let query = `rpc/citation_by_software?software=eq.${software}&order=publication_year.desc,mention_type,doi&offset=${offset}&limit=${rows}`
    if (search){
      query += `&or=(title.ilike.*${search}*,authors.ilike.*${search}*,publisher.ilike.*${search}*,url.ilike.*${search}*)`
    }
    // construct url
    const url = `${getBaseUrl()}/${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'count=exact'
      }
    })
    if ([200,206].includes(resp.status)===true) {
      const json:CitationItemProps[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        citations: json,
      }
    }
    logger(`getCitationsForSoftware: [${resp.status}] [${url}]`, 'error')
    // query not found
    return {
      count:0,
      citations:[]
    }
  } catch (e: any) {
    logger(`getCitationsForSoftware: ${e?.message}`, 'error')
    return {
      count:0,
      citations:[]
    }
  }
}

export async function getCitationCountForSoftware(software:string,token:string){
  try {
    // the content is ordered by type ascending
    let query = `rpc/citation_by_software?software=eq.${software}&order=publication_year.desc,mention_type&offset=0&limit=3`
    // construct url
    const url = `${getBaseUrl()}/${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'count=exact'
      }
    })
    if ([200,206].includes(resp.status)===true) {
      return extractCountFromHeader(resp.headers) ?? 0
    }
    logger(`getCitationCountForSoftware: [${resp.status}] [${url}]`, 'error')
    return 0
  } catch (e: any) {
    logger(`getCitationCountForSoftware: ${e?.message}`, 'error')
    return 0
  }
}
