// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {DataciteWorkGraphQLResponse, DataciteWorksGraphQLResponse, WorkResponse} from '~/types/Datacite'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import {createJsonHeaders, extractRespFromGraphQL, extractReturnMessage} from './fetchHelpers'
import logger from './logger'
import {makeDoiRedirectUrl} from './getDOI'

function graphQLDoiQuery(doi:string) {
  const gql = `{
    work(id: "${doi}"){
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
  }`
  return gql
}

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

function extractAuthors(item: WorkResponse) {
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

export function dataCiteGraphQLItemToMentionItem(item: WorkResponse) {
  const mention: MentionItemProps = {
    id: null,
    doi: item.doi,
    url: makeDoiRedirectUrl(item.doi),
    title: item.titles[0].title,
    authors: extractAuthors(item),
    publisher: item.publisher.name,
    publication_year: item.publicationYear,
    journal: null,
    page: null,
    image_url: null,
    mention_type: dataciteToRsdType(item),
    source: 'DataCite',
    note: null,
    openalex_id: null
  }
  return mention
}

export async function getDataciteItemByDoiGraphQL(doi: string) {
  try {
    const query = graphQLDoiQuery(doi)
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
      const json: DataciteWorkGraphQLResponse = await resp.json()
      return {
        status:200,
        message:json.data.work,
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

function dataciteToRsdType(item: WorkResponse): MentionTypeKeys {
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
