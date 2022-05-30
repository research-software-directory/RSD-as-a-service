import {DataciteWorkGraphQLResponse, DataciteWorksGraphQLResponse, WorkResponse} from '~/types/Datacite'
import {MentionItemProps} from '~/types/Mention'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import {apiMentionTypeToRSDTypeKey} from './editMentions'
import logger from './logger'
import {makeDoiRedirectUrl} from './getDOI'

function graphQLDoiQuery(doi:string) {
  const gql = `{
    work(id: "${doi}"){
      doi,
      type,
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
    work(id:"${doi}"){
      doi,
      type,
      titles(first:1){
        title
      },
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
    works(query:"titles.title:${title}",first:30){
      nodes{
        doi,
        type,
        type,
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
  const authors = item.creators.map(author => {
    return `${author.givenName} ${author.familyName}`
  })
  item.contributors.forEach(author => {
    authors.push(`${author.givenName} ${author.familyName}`)
  })
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
    is_featured: false,
    mention_type: apiMentionTypeToRSDTypeKey(item.type),
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
    logger(`getMentionByDoi: ${e?.message}`, 'error')
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
      if (json.data.works.nodes) return json.data.works.nodes
      return []
    }
    logger(`getDataciteItemsByTitleGraphQL: ${resp.status}: ${resp?.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getDataciteItemsByTitleGraphQL: ${e?.message}`, 'error')
    return []
  }
}
