// SPDX-FileCopyrightText: 2022 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {DataciteWorkRestResponse, DataciteWorksGraphQLResponse, WorkResponse} from '~/types/Datacite'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import {createJsonHeaders, extractRespFromGraphQL, extractReturnMessage} from './fetchHelpers'
import logger from './logger'
import {makeDoiRedirectUrl} from './getDOI'


function graphQLDoisQuery(dois: string[]) {
  const doisString = dois.map(doi => `"${doi}"`).join(',')
  const gql = `{
    works(ids: [${doisString}], first: 10000) {
      nodes {
        doi,
        type,
        types{
          resourceType
        },
        sizes,
        version,
        titles(first: 1){
          title
        },
        descriptions(first:1){
          description
        },
        publisher {
          name
        },
        publicationYear,
        creators{
          givenName,
            familyName,
            affiliation{
            name
          }
        },
        contributors{
          givenName,
            familyName,
            affiliation{
            name
          }
        }
      }
    }
  }`
  return gql
}

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

function gqlWorksByTitleQuery(title: string) {
  const gql = `{
    works(query:"titles.title:${title}",first:10){
      nodes{
        doi,
        type,
        types{
          resourceType
        },
        sizes,
    	  version,
        titles(first: 1){
          title
        },
        descriptions(first:1){
          description
        },
        publisher {
          name
        },
        publicationYear,
        creators{
          givenName,
            familyName,
            affiliation{
            name
          }
        },
        contributors{
          givenName,
            familyName,
            affiliation{
            name
          }
        }
      }
    }
  }
  `
  return gql
}

function extractGraphqlAuthors(item: WorkResponse) {
  const authors: string[] = []
  // extract info from creators
  if (item.creators) {
    item.creators.forEach(author => {
      if (author.givenName && author.familyName) {
        authors.push(`${author.givenName} ${author.familyName}`)
      }
    })
  }
  // extract info from contributors
  if (item.contributors) {
    item.contributors.forEach(author => {
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

function extractRestAuthors(item: DataciteWorkRestResponse): string {
  const authors: string[] = []
  // extract info from creators
  if (item.data.attributes.creators) {
    item.data.attributes.creators.forEach(author => {
      if (author.givenName && author.familyName) {
        authors.push(`${author.givenName} ${author.familyName}`)
      }
    })
  }
  // extract info from contributors
  if (item.data.attributes.contributors) {
    item.data.attributes.contributors.forEach(author => {
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

export function dataCiteGraphQLItemToMentionItem(item: WorkResponse) {
  const mention: MentionItemProps = {
    id: null,
    doi: item.doi,
    url: makeDoiRedirectUrl(item.doi),
    title: item.titles[0].title,
    authors: extractGraphqlAuthors(item),
    publisher: item.publisher.name,
    publication_year: item.publicationYear,
    journal: null,
    page: null,
    image_url: null,
    mention_type: dataciteGraphqlToRsdType(item),
    source: 'DataCite',
    note: null,
    openalex_id: null
  }
  return mention
}

export function dataCiteRestItemToMentionItem(item: DataciteWorkRestResponse): MentionItemProps {
  const attributes = item.data.attributes

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
      const json: DataciteWorkRestResponse = await resp.json()
      return {
        status: 200,
        message: dataCiteRestItemToMentionItem(json),
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

export async function getDataciteItemsByDoiGraphQL(dois: string[]) {
  try {
    const query = graphQLDoisQuery(dois)
    const url = 'https://api.datacite.org/graphql'

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify({
        operationName: null,
        variables:{},
        query,
      }),
    })

    if (resp.status === 200) {
      const json = await resp.json()
      return {
        status:200,
        message:json.data.works.nodes,
      }
    }
    const error = await extractReturnMessage(resp)
    return error
  } catch (e: any) {
    logger(`getDataciteItemsByDoiGraphQL: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message,
    }
  }
}

export async function getDataciteItemsByTitleGraphQL(title: string) {
  try {
    const query = gqlWorksByTitleQuery(title.replace(':', '\\\\:'))
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
    if (resp.status === 200) {
      const json: DataciteWorksGraphQLResponse = await resp.json()
      if (json.data.works && json.data.works.nodes) return json.data.works.nodes
      return []
    }
    logger(`getDataciteItemsByTitleGraphQL: ${resp.status}: ${resp?.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getDataciteItemsByTitleGraphQL: ${e?.message}`, 'error')
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

function dataciteGraphqlToRsdType(item: WorkResponse): MentionTypeKeys {
  switch (item.type.trim().toLowerCase()) {
  // additional validation using resourceType
    case 'audiovisual':
      return rsdTypeFromResourceType(item.types.resourceType)
    case 'text':
      return rsdTypeFromResourceType(item.types.resourceType)
    default:
    // by default using type value
      return rsdTypeFromResourceType(item.type)
  }
}

function dataciteRestToRsdType(item: DataciteWorkRestResponse): MentionTypeKeys {
  switch (item.data.attributes.types.resourceTypeGeneral.trim().toLowerCase()) {
    // additional validation using resourceType
    case 'text':
      return rsdTypeFromResourceType(item.data.attributes.types.resourceType)
    default:
      // by default using type value
      return rsdTypeFromResourceType(item.data.attributes.types.resourceTypeGeneral)
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
