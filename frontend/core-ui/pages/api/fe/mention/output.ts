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
export async function searchForAvailableOutput({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/rpc/search_output_for_project`
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        project_id: project,
        search_text: searchFor
      })
    })
    // debugger
    if (resp.status === 200) {
      const json: MentionItemProps[] = await resp.json()
      return json
    }
    logger(`searchForAvailableOutput: 404 [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`searchForAvailableOutput: ${e?.message}`, 'error')
    return []
  }
}

export async function findPublicationByTitle({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const promises = [
    promiseWithTimeout(getCrossrefItemsByTitle(searchFor), crossrefTimeoutSec),
    getDataciteItemsByTitleGraphQL(searchFor),
    searchForAvailableOutput({
      project,
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
    logger(`output.findPublicationByTitle: Crossref request timeout after ${crossrefTimeoutSec}sec.`, 'warn')
  }
  // convert datacite responses to MentionItems
  let dataciteItems: MentionItemProps[] = []
  if (datacite.status === 'fulfilled') {
    dataciteItems = datacite?.value.map(item => {
      return dataCiteGraphQLItemToMentionItem(item as WorkResponse)
    })
  } else {
    logger(`output.findPublicationByTitle: Datacite request failed ${datacite.reason}`, 'warn')
  }
  // change items source to RSD for ones pulled from RSD
  let rsdItems: MentionItemProps[] = []
  if (rsd.status === 'fulfilled') {
    rsdItems = rsd.value as MentionItemProps[]
  } else {
    logger(`output.findPublicationByTitle: RSD request failed ${rsd.reason}`, 'warn')
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
    const project = extractParam(req, 'id')
    const searchFor = extractParam(req, 'search')
    const session = getSessionSeverSide(req, res)
    if (session?.status !== 'authenticated') {
      return res.status(401).json({
        message: '401 Unauthorized'
      })
    }

    const mentions = await findPublicationByTitle({
      project,
      searchFor,
      token:session.token
    })

    res.status(200).json(mentions)

  } catch (e: any) {
    logger(`api.impact: ${e.message}`, 'error')
    res.status(500).json({message: e.message})
  }
}
