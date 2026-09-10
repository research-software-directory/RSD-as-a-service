// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {DataciteMultipleWorksRestResponse, DataciteRestWork, DataciteSingleWorkRestResponse,} from '~/types/Datacite'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import {createJsonHeaders, extractRespFromGraphQL, extractReturnMessage} from './fetchHelpers'
import logger from './logger'
import {makeDoiRedirectUrl} from './getDOI'


function gqlConceptDoiQuery(doi: string) {
  const gql =`{
    software(id:"${doi}"){
      relatedIdentifiers {
        relationType
        relatedIdentifierType
        relatedIdentifier
      }
    }
  }`
  return gql
}


function extractRestAuthors(item: DataciteRestWork): string {
  const authors: string[] = []
  // extract info from creators
  if (item.attributes.creators) {
    item.attributes.creators.forEach(author => {
      if (author.givenName && author.familyName) {
        authors.push(`${author.givenName} ${author.familyName}`)
      }
    })
  }
  // extract info from contributors
  if (item.attributes.contributors) {
    item.attributes.contributors.forEach(author => {
      if (author.givenName && author.familyName) {
        authors.push(`${author.givenName} ${author.familyName}`)
      }
    })
  }

  if (authors.length > 0) {
    return authors.join(', ')
  }

  return ''
}


export function dataCiteRestItemToMentionItem(item: DataciteRestWork): MentionItemProps {
  const attributes = item.attributes

  return {
    id: null,
    doi: attributes.doi,
    url: makeDoiRedirectUrl(attributes.doi),
    title: attributes.titles[0].title,
    authors: extractRestAuthors(item),
    publisher: attributes.publisher,
    publication_year: attributes.publicationYear,
    journal: null,
    page: null,
    image_url: null,
    mention_type: dataciteRestToRsdType(item),
    source: 'DataCite',
    note: null,
    openalex_id: null
  }
}

export async function getDataciteItemByDoi(doi: string) {
  try {
    const url = `https://api.datacite.org/dois/${encodeURIComponent(doi)}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: DataciteSingleWorkRestResponse = await resp.json()
      return {
        status: 200,
        message: dataCiteRestItemToMentionItem(json.data),
      }
    }
    return await extractReturnMessage(resp)
  } catch (e: any) {
    logger(`getDataciteItemByDoi: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message,
    }
  }
}

export async function getDataciteItemsByDoi(dois: string[]) {
  try {
    const promises: Promise<any>[] = []
    const doiToResult: Map<string, any> = new Map()

    for (const doi of dois) {
      const getItemPromise = getDataciteItemByDoi(doi)
        .then(item => doiToResult.set(doi, item))
        .catch(error => doiToResult.set(doi, {status: 500, message: error}))

      promises.push(getItemPromise)
    }

    await Promise.allSettled(promises)
    return {
      status: 200,
      message: doiToResult
    }
  } catch (e: any) {
    logger(`getDataciteItemsByDoi: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message,
    }
  }
}

export async function getDataciteItemsByTitleRest(title: string): Promise<MentionItemProps[]> {
  try {
    // https://docs.opensearch.org/latest/query-dsl/full-text/query-string/#reserved-characters
    const reservedStrings = ['+','-','=','&&','||','>','<','!','(',')','{','}','[',']','^','"','~','*','?',':','\\','/']
    const titleEncoded = encodeURIComponent(title)
    const searchUrl = `https://api.datacite.org/dois?query=titles.title:"${titleEncoded}"`

    // const query = gqlWorksByTitleQuery(title.replace(':', '\\\\:'))

    const resp = await fetch(searchUrl)
    if (resp.status === 200) {
      const json: DataciteMultipleWorksRestResponse = await resp.json()
      const result: MentionItemProps[] = []

      for (const work of json.data) {
        result.push(dataCiteRestItemToMentionItem(work))
      }

      return result
    }
    logger(`getDataciteItemsByTitleRest: ${resp.status}: ${resp?.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getDataciteItemsByTitleRest: ${e?.message}`, 'error')
    return []
  }
}


export async function getSoftwareVersionInfoForDoi(doi: string) {
  try {
    const query = gqlConceptDoiQuery(doi)
    const url = 'https://api.datacite.org/graphql'

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify({
        operationName: null,
        variables: {},
        query,
      }),
    })

    const json = await extractRespFromGraphQL(resp)
    return json
  } catch (e: any) {
    logger(`getConceptDoiByDoi: ${e?.message}`, 'error')
    return undefined
  }
}


function dataciteRestToRsdType(item: DataciteRestWork): MentionTypeKeys {
  switch (item.attributes.types.resourceTypeGeneral.trim().toLowerCase()) {
    // additional validation using resourceType
    case 'text':
      return rsdTypeFromResourceType(item.attributes.types.resourceType)
    default:
      // by default using type value
      return rsdTypeFromResourceType(item.attributes.types.resourceTypeGeneral)
  }
}

function rsdTypeFromResourceType(resourceType: string) {
  if (!resourceType) return 'other'
  switch (resourceType.trim().toLowerCase()) {
    case 'book set':
    case 'book series':
    case 'book track':
    case 'book':
      return 'book'
    case 'book part':
    case 'book chapter':
    case 'bookchapter':
    case 'book section':
      return 'bookSection'
    case 'conference paper':
    case 'conferencepaper':
    case 'proceedings series':
    case 'proceedings article':
    case 'conference proceeding':
    case 'conferenceproceeding':
      return 'conferencePaper'
    case 'dissertation':
    case 'studyregistration':
    case 'thesis':
      return 'thesis'
    case 'dataset':
      return 'dataset'
    case 'interview':
      return 'interview'
    case 'journal':
    case 'journal volume':
    case 'journal issue':
    case 'journal article':
    case 'journalarticle':
      return 'journalArticle'
    case 'magazine-article':
    case 'magazine article':
      return 'magazineArticle'
    case 'newspaper-article':
    case 'newspaper article':
      return 'newspaperArticle'
    case 'audiovisual':
    case 'poster':
      return 'poster'
    case 'presentation':
      return 'presentation'
    case 'report series':
    case 'report':
      return 'report'
    case 'software':
    case 'computer program':
    case 'computational notebook':
    case 'computationalnotebook':
      return 'computerProgram'
    case 'video recording':
      return 'videoRecording'
    case 'webpage':
      return 'webpage'
    case 'event':
      return 'workshop'
    default:
      return 'other'
  }
}
