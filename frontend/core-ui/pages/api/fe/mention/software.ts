// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {getSessionSeverSide} from '~/auth'
import {CrossrefSelectItem} from '~/types/Crossref'
import {WorkResponse} from '~/types/Datacite'
import {MentionItemProps} from '~/types/Mention'
import {extractParam,Error} from '~/utils/apiHelpers'
import {createJsonHeaders, getBaseUrl, promiseWithTimeout} from '~/utils/fetchHelpers'
import {crossrefItemToMentionItem, getCrossrefItemsByTitle} from '~/utils/getCrossref'
import {dataCiteGraphQLItemToMentionItem, getDataciteItemsByTitleGraphQL} from '~/utils/getDataCite'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'
import logger from '~/utils/logger'
import {sortBySearchFor} from '~/utils/sortFn'
import {crossrefTimeoutSec} from './impact'

/**
 * Searching for items in mention table which are NOT assigned to impact of the project already.
 * @returns MentionItem[]
 */
export async function searchForAvailableMentions({software, searchFor, token}:
  { software: string, searchFor: string, token: string }) {
  const limit = 10
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/rpc/search_mentions_for_software?software_id=${software}&search_text=${searchFor}&limit=${limit}`
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
    logger(`searchForAvailableMentions: ${resp.status} ${resp.statusText} [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`searchForAvailableMentions: ${e?.message}`, 'error')
    return []
  }
}

export async function findPublicationByTitle({software, searchFor, token}:
  { software: string, searchFor: string, token: string }) {
  const promises = [
    promiseWithTimeout(getCrossrefItemsByTitle(searchFor), crossrefTimeoutSec),
    getDataciteItemsByTitleGraphQL(searchFor),
    searchForAvailableMentions({
      software,
      searchFor,
      token
    })
  ]
  // make requests
  const [crossref, datacite, rsd] = await Promise.allSettled(promises)
  // convert crossref responses to MentionItems
  let crosrefItems: MentionItemProps[] = []
  if (crossref.status === 'fulfilled') {
    crosrefItems = crossref?.value.map(item => {
      return crossrefItemToMentionItem(item as CrossrefSelectItem)
    })
  } else {
    logger(`software.findPublicationByTitle: Crossref request timeout after ${crossrefTimeoutSec}sec.`, 'warn')
  }
  // convert datacite responses to MentionItems
  let dataciteItems: MentionItemProps[] = []
  if (datacite.status === 'fulfilled') {
    dataciteItems = datacite?.value.map(item => {
      return dataCiteGraphQLItemToMentionItem(item as WorkResponse)
    })
  } else {
    logger(`software.findPublicationByTitle: Datacite request failed ${datacite.reason}`, 'warn')
  }
  // change items source to RSD for ones pulled from RSD
  let rsdItems: MentionItemProps[] = []
  if (rsd.status === 'fulfilled') {
    rsdItems = rsd.value as MentionItemProps[]
  } else {
    logger(`software.findPublicationByTitle: RSD request failed ${rsd.reason}`, 'warn')
  }
  // return results
  const sorted = [
    // RSD items at the top
    ...rsdItems,
    // Crossref items not existing in RSD
    ...itemsNotInReferenceList({
      list: crosrefItems,
      referenceList: rsdItems,
      key: 'doi'
    }),
    // Datacite items not existing in RSD
    ...itemsNotInReferenceList({
      list: dataciteItems,
      referenceList: rsdItems,
      key: 'doi'
    })
  ].sort((a, b) => sortBySearchFor(a, b, 'title', searchFor))
  return sorted
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MentionItemProps[] | Error>
) {
  try {
    // extract query parameters
    const software = extractParam(req, 'id')
    const searchFor = extractParam(req, 'search')
    const session = getSessionSeverSide(req, res)
    if (session?.status !== 'authenticated') {
      return res.status(401).json({
        message: '401 Unauthorized'
      })
    }

    const mentions = await findPublicationByTitle({
      software,
      searchFor,
      token:session.token
    })

    res.status(200).json(mentions)

  } catch (e: any) {
    logger(`api.software: ${e.message}`, 'error')
    res.status(500).json({message: e.message})
  }
}
