
import {CrossrefResponse, CrossrefSelectItem, crossrefSelectProps, crossrefType} from '~/types/Crossref'
import {MentionItemProps} from '~/types/Mention'
import {apiMentionTypeToRSDTypeKey} from './editMentions'
import {extractReturnMessage} from './fetchHelpers'
import {makeDoiRedirectUrl} from './getDOI'
import logger from './logger'


function extractAuthors(item: CrossrefSelectItem) {
  if (item.author) {
    return item.author.map(author => {
      return `${author.given} ${author.family}`
    }).join(', ')
  }
  return ''
}

function extractYearPublished(item: CrossrefSelectItem) {
  if (item.published &&
    item.published['date-parts'] &&
    item.published['date-parts'].length > 0) {
    // first data item
    const dateItem = item.published['date-parts'][0]
    if (typeof dateItem === 'object') {
      return dateItem[0]
    }
    return dateItem
  }
  return null
}

export function crossrefItemToMentionItem(item: CrossrefSelectItem) {
  const mention: MentionItemProps = {
    id: null,
    doi: item.DOI,
    url: makeDoiRedirectUrl(item.DOI),
    // take first title from array returned
    title: item.title[0],
    authors: extractAuthors(item),
    publisher: item.publisher,
    // extract only Year
    publication_year: extractYearPublished(item),
    page: item.page ?? null,
    image_url: null,
    mention_type: apiMentionTypeToRSDTypeKey(item.type),
    source: 'Crossref'
  }
  // debugger
  return mention
}

export async function getCrossrefItemByDoi(doi: string) {
  try {
    const filter = `filter=doi:${doi}`
    const select = `select=${crossrefSelectProps.join(',')}`
    // const ettiquete = 'mailto=mijatovic1970@gmail.com'
    const url = `https://api.crossref.org/works?${filter}&${select}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: CrossrefResponse = await resp.json()
      // find doi item
      const doiItem = json.message.items.filter(item => item.DOI.toLowerCase() === doi.toLocaleLowerCase())
      // if found return it
      if (doiItem.length === 1) {
        return {
          status: 200,
          message: doiItem[0]
        }
      }
    }
    const error = await extractReturnMessage(resp)
    return error
  }catch(e:any){
    logger(`getCrossrefItemByDoi: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getCrossrefItemsByTitle(title: string) {
  try {
    const filter = `query.title=${title}`
    const select = `select=${crossrefSelectProps.join(',')}`
    const ettiquete = 'mailto=mijatovic1970@gmail.com'
    const order = 'sort=score&order=desc'
    const rows = 'rows=10'
    // get top 30 items
    const url = `https://api.crossref.org/works?${filter}&${select}&${ettiquete}&${order}&${rows}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: CrossrefResponse = await resp.json()
      // find doi item
      return json.message.items
    }
    logger(`getCrossrefItemsByTitle: ${resp.status}: ${resp?.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getCrossrefItemsByTitle: ${e?.message}`, 'error')
    return []
  }
}

export async function getCrossrefItemsByQuery(query: string) {
  try {
    const filter = `query=${query}`
    const select = `select=${crossrefSelectProps.join(',')}`
    const ettiquete = 'mailto=mijatovic1970@gmail.com'
    const order = 'sort=published&order=desc'
    const rows = 'rows=10'
    // get top 10 items
    const url = `https://api.crossref.org/works?${filter}&${select}&${ettiquete}&${order}&${rows}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json: CrossrefResponse = await resp.json()
      // find doi item
      return json.message.items
    }
  } catch (e: any) {
    logger(`getCrossrefItemsByQuery: ${e?.message}`, 'error')
  }
}

