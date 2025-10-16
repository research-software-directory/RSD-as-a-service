// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {type NextRequest} from 'next/server'

import {getUserFromToken} from '~/auth/getSessionServerSide'
import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl, promiseWithTimeout} from '~/utils/fetchHelpers'
import {crossrefItemToMentionItem, getCrossrefItemsByTitle} from '~/utils/getCrossref'
import {dataCiteGraphQLItemToMentionItem, getDataciteItemsByTitleGraphQL} from '~/utils/getDataCite'
import {itemsNotInReferenceList} from '~/utils/itemsNotInReferenceList'
import {sortBySearchFor} from '~/utils/sortFn'
import {getOpenalexMentionsByTitle} from '~/utils/getOpenalex'
import {MentionItemProps} from '~/types/Mention'
import {CrossrefSelectItem} from '~/types/Crossref'
import {WorkResponse} from '~/types/Datacite'
import {getUserSettings} from '~/components/user/ssrUserSettings'

const crossrefTimeoutSec = 30

type RelationType = 'software' | 'impact' | 'output'

/**
 * Based on where is request coming from we need to use
 * different rpc and pass proper id key required by RPC
 * @param relationType
 * @returns
 */
function getInfoForRelationType(relationType: RelationType) {
  switch (relationType) {
    case 'software':
      return {
        url:`${getBaseUrl()}/rpc/search_mentions_for_software`,
        key: 'software_id'
      }
    case 'impact':
      return {
        url: `${getBaseUrl()}/rpc/search_impact_for_project`,
        key: 'project_id'
      }
    case 'output':
      return {
        url: `${getBaseUrl()}/rpc/search_output_for_project`,
        key: 'project_id'
      }
  }
}

/**
 * Searching for items in mention table which are NOT already assigned to this software/project.
 * @returns MentionItem[]
 */
async function searchForAvailableMentions({id, searchFor, token, relationType}: {
  id: string,
  searchFor: string,
  token: string,
  relationType: RelationType
}) {

  const {url,key} = getInfoForRelationType(relationType)
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        [key]: id,
        search_text: searchFor
      })
    })
    // debugger
    if (resp.status === 200) {
      const json: MentionItemProps[] = await resp.json()
      return json
    }
    logger(`api/fe/mention/find_by_title.searchForAvailableMentions: 404 [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`api/fe/mention/find_by_title.searchForAvailableMentions: ${e?.message}`, 'error')
    return []
  }
}

async function findPublicationByTitle({id, searchFor, token, relationType}: {
  id: string,
  searchFor: string,
  token: string,
  relationType: RelationType
}) {
  const promises: Promise<any>[] = [
    promiseWithTimeout(getCrossrefItemsByTitle(searchFor), crossrefTimeoutSec),
    getDataciteItemsByTitleGraphQL(searchFor),
    getOpenalexMentionsByTitle(searchFor),
    searchForAvailableMentions({
      id,
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
    logger(`api/fe/mention/find_by_title.findPublicationByTitle: Crossref request timeout after ${crossrefTimeoutSec}sec.`, 'warn')
  }
  // convert datacite responses to MentionItems
  let dataciteItems: MentionItemProps[] = []
  if (datacite.status === 'fulfilled') {
    dataciteItems = datacite?.value.map((item: WorkResponse) => {
      return dataCiteGraphQLItemToMentionItem(item)
    })
  } else {
    logger(`api/fe/mention/find_by_title.findPublicationByTitle: Datacite request failed ${datacite.reason}`, 'warn')
  }

  let openalexMentions: MentionItemProps[] = []
  if (openalex.status === 'fulfilled') {
    if (openalex.value.status === 200) {
      openalexMentions = openalex.value.result as MentionItemProps[]
    }
  } else {
    logger(`api/fe/mention/find_by_title.findPublicationByTitle: OpenAlex request failed ${openalex.reason}`, 'warn')
  }

  // change items source to RSD for ones pulled from RSD
  let rsdItems: MentionItemProps[] = []
  if (rsd.status === 'fulfilled') {
    rsdItems = rsd.value as MentionItemProps[]
  } else {
    logger(`api/fe/mention/find_by_title.findPublicationByTitle: RSD request failed ${rsd.reason}`, 'warn')
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

/**
 * GET api/fe/mention/find_by_title
 */
export async function GET(request: NextRequest) {
  try{
    // extract parameters
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const searchFor = searchParams.get('search')
    const relationType = searchParams.get('relation_type') as RelationType

    // get token
    const {token} = await getUserSettings()
    // validate token
    const user = getUserFromToken(token)
    if (user===null || token === undefined){
      return Response.json({
        'status': 401,
        'message': '401 Unauthorized'
      },{
        status: 401,
        statusText: 'Unauthorized'
      })
    }

    // validate params
    if (!id || !searchFor || !relationType){
      return Response.json({
        'status': 400,
        'message': 'Parameter id, search of relation_type missing'
      },{
        status: 400,
        statusText: 'Parameter id, search of relation_type missing'
      })
    }

    // validate relation_type
    if (!['software', 'impact', 'output'].includes(relationType ?? 'null')) {
      return Response.json({
        'status': 400,
        'message': 'Please provide a valid relation_type (software, impact or output)'
      },{
        status: 400,
        statusText: 'Please provide a valid relation_type (software, impact or output)'
      })
    }

    const mentions = await findPublicationByTitle({
      id,
      searchFor,
      token,
      relationType
    })

    // return mentions list found
    // in case of error we return []
    return Response.json(mentions)

  }catch(e:any){
    // server error 500
    logger(`api/fe/mention/find_by_title: ${e?.message ?? 'Unknown error'}`,'error')
    return Response.json({
      status: 500,
      message: e?.message ?? 'Unknown error'
    },{
      status: 500,
      statusText: e?.message ?? 'Unknown error'
    })
  }
}
