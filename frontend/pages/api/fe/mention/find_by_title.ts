// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import type {NextApiRequest, NextApiResponse} from 'next'
import {MentionItemProps} from '~/types/Mention'
import {Error, extractParam} from '~/utils/apiHelpers'
import {getSessionSeverSide} from '~/auth'
import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl, promiseWithTimeout} from '~/utils/fetchHelpers'
import {crossrefItemToMentionItem, getCrossrefItemsByTitle} from '~/utils/getCrossref'
import {dataCiteGraphQLItemToMentionItem, getDataciteItemsByTitleGraphQL} from '~/utils/getDataCite'
import {CrossrefSelectItem} from '~/types/Crossref'
import {WorkResponse} from '~/types/Datacite'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'
import {sortBySearchFor} from '~/utils/sortFn'
import {getOpenalexMentionsByTitle} from '~/utils/getOpenalex'

const crossrefTimeoutSec = 30

type RelationType = 'software' | 'impact' | 'output'

function getUrlForRelationType(relationType: RelationType): string {
  const baseUrl = getBaseUrl()
  switch (relationType) {
    case 'software':
      return `${baseUrl}/rpc/search_mentions_for_software`
    case 'impact':
      return `${baseUrl}/rpc/search_impact_for_project`
    case 'output':
      return `${baseUrl}/rpc/search_output_for_project`
  }
}

/**
 * Searching for items in mention table which are NOT assigned to impact of the project already.
 * @returns MentionItem[]
 */
export async function searchForAvailableMentions({project, searchFor, token, relationType}: {
  project: string,
  searchFor: string,
  token: string,
  relationType: RelationType
}) {

  const url = getUrlForRelationType(relationType)
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
    logger(`searchForAvailableMentions: 404 [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`searchForAvailableMentions: ${e?.message}`, 'error')
    return []
  }
}

export async function findPublicationByTitle({project, searchFor, token, relationType}: {
  project: string,
  searchFor: string,
  token: string,
  relationType: RelationType
}) {
  const promises: Promise<any>[] = [
    promiseWithTimeout(getCrossrefItemsByTitle(searchFor), crossrefTimeoutSec),
    getDataciteItemsByTitleGraphQL(searchFor),
    getOpenalexMentionsByTitle(searchFor),
    searchForAvailableMentions({
      project,
      searchFor,
      token,
      relationType
    })
  ]
  // make requests
  const [crossref, datacite, openalex, rsd] = await Promise.allSettled(promises)
  // convert crossref responses to MentionItems
  let crosrefItems: MentionItemProps[] = []
  if (crossref.status === 'fulfilled') {
    crosrefItems = crossref?.value.map((item: CrossrefSelectItem) => {
      try {
        return crossrefItemToMentionItem(item)
      } catch {
        return null
      }
    })
      .filter((item: MentionItemProps | null) => item !== null)
  } else {
    logger(`impact.findPublicationByTitle: Crossref request timeout after ${crossrefTimeoutSec}sec.`, 'warn')
  }
  // convert datacite responses to MentionItems
  let dataciteItems: MentionItemProps[] = []
  if (datacite.status === 'fulfilled') {
    dataciteItems = datacite?.value.map((item: WorkResponse) => {
      return dataCiteGraphQLItemToMentionItem(item)
    })
  } else {
    logger(`impact.findPublicationByTitle: Datacite request failed ${datacite.reason}`, 'warn')
  }

  let openalexMentions: MentionItemProps[] = []
  if (openalex.status === 'fulfilled') {
    if (openalex.value.status === 200) {
      openalexMentions = openalex.value.result as MentionItemProps[]
    }
  } else {
    logger(`find_by_title.findPublicationByTitle: OpenAlex request failed ${openalex.reason}`, 'warn')
  }

  // change items source to RSD for ones pulled from RSD
  let rsdItems: MentionItemProps[] = []
  if (rsd.status === 'fulfilled') {
    rsdItems = rsd.value as MentionItemProps[]
  } else {
    logger(`find_by_title.findPublicationByTitle: RSD request failed ${rsd.reason}`, 'warn')
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
    }),
    // OpenAlex items not existing in RSD
    ...itemsNotInReferenceList({
      list: openalexMentions,
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
    const relationType = extractParam(req, 'relation_type')
    if (!['software', 'impact', 'output'].includes(relationType)) {
      return res.status(400).json({
        message: 'Please provide a valid relation_type (software, impact or output)'
      })
    }
    const relationTypeChecked = relationType as RelationType
    const session = getSessionSeverSide(req, res)
    if (session?.status !== 'authenticated') {
      return res.status(401).json({
        message: '401 Unauthorized'
      })
    }

    const mentions = await findPublicationByTitle({
      project,
      searchFor,
      token: session.token,
      relationType: relationTypeChecked
    })

    res.status(200).json(mentions)

  } catch (e: any) {
    logger(`api.find_by_title: ${e.message}`, 'error')
    res.status(500).json({message: e.message})
  }
}
