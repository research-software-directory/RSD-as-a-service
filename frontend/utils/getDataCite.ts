// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
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
      publisher,
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

function gqlConceptDoiQuery(doi: string) {
  const gql =`{
    software(id:"${doi}"){
      doi,
      versionCount,
      versionOfCount,
      versionOf{
        nodes{
          doi
        }
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
        publisher,
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
  let authors: string[] = []
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
    publisher: item.publisher,
    publication_year: item.publicationYear,
    page: null,
    image_url: null,
    mention_type: dataciteToRsdType(item),
    source: 'DataCite'
  }
  return mention
}

export async function getDataciteItemsByDoiGraphQL(doi: string) {
  try {
    const query = graphQLDoiQuery(doi)
    const url = 'https://api.datacite.org/graphql'

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify({
        operationName: null,
        variables:{},
        query
      })
    })

    if (resp.status === 200) {
      const json: DataciteWorkGraphQLResponse = await resp.json()
      return {
        status:200,
        message:json.data.work
      }
    }
    const error = await extractReturnMessage(resp)
    return error
  } catch (e: any) {
    logger(`getDataciteItemsByDoiGraphQL: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getDataciteItemsByTitleGraphQL(title: string) {
  try {
    const query = gqlWorksByTitleQuery(title)
    const url = 'https://api.datacite.org/graphql'

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(),
      body: JSON.stringify({
        operationName: null,
        variables: {},
        query
      })
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
        query
      })
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
    case 'book section':
      return 'bookSection'
    case 'conference paper':
    case 'proceedings series':
    case 'proceedings article':
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
      return 'journalArticle'
    case 'magazine-article':
    case 'magazine article':
      return 'magazineArticle'
    case 'newspaper-article':
    case 'newspaper article':
      return 'newspaperArticle'
    case 'presentation':
      return 'presentation'
    case 'report series':
    case 'report':
      return 'report'
    case 'software':
    case 'computer program':
      return 'computerProgram'
    case 'video recording':
      return 'videoRecording'
    case 'webpage':
      return 'webpage'
    default:
      return 'other'
  }
}
