// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {CrossrefResponse, CrossrefSelectItem} from '~/types/Crossref'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import {extractReturnMessage} from './fetchHelpers'
import {makeDoiRedirectUrl} from './getDOI'
import logger from './logger'
import {PromisePool} from '~/utils/promisePool'

// size 5 got from email communication with Crossref and testing
const promisePool = new PromisePool(5)

function addPoliteEmail(url: string) {
  const mailto = process.env.CROSSREF_CONTACT_EMAIL
  // console.log('addPoliteEmail...',mailto)
  if (mailto) {
    return url + `mailto=${mailto}`
  }
  return url
}


function extractAuthors(item: CrossrefSelectItem) {
  if (item.author) {
    return item.author.map(author => {
      if (author.given && author.family) {
        return `${author.given} ${author.family}`
      }
      if (author.name) {
        return author.name
      }
      if (author.given) {
        return author.given
      }
      if (author.family) {
        return author.family
      }
    }).join(', ')
  }
  return null
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

export function crossrefItemToMentionItem(item: CrossrefSelectItem): MentionItemProps {
  if (!Array.isArray(item.title) || item.title.length == 0 || !item.title[0]) {
    throw new Error(`Title is missing for mention with DOI ${item.DOI}`)
  }

  const mention: MentionItemProps = {
    id: null,
    doi: item.DOI,
    url: makeDoiRedirectUrl(item.DOI),
    // take first title from the returned array
    title: item.title[0],
    authors: extractAuthors(item),
    publisher: item.publisher,
    // extract only Year
    publication_year: extractYearPublished(item),
    journal: item['container-title']?.length ? item['container-title'].join(', ') : null,
    page: item.page ?? null,
    image_url: null,
    mention_type: crossrefToRsdType(item.type),
    source: 'Crossref',
    note: null,
    openalex_id: null
  }
  // debugger
  return mention
}

export async function getCrossrefItemByDoi(doi: string) {
  try {
    const url = addPoliteEmail(`https://api.crossref.org/works/${doi}?`)

    const resp = await promisePool.submit(() => fetch(url))

    if (resp.status === 200) {
      const json: CrossrefResponse = await resp.json()
      // if found return item
      if (json.message) {
        return {
          status: 200,
          message: json.message
        }
      } else {
        return {
          status: 404,
          message: 'DOI not found'
        }
      }
    }
    return await extractReturnMessage(resp)
  } catch (e: any) {
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
    const order = 'sort=score&order=desc'
    const rows = 'rows=10'
    // get top 10 items
    const url = addPoliteEmail(`https://api.crossref.org/works?${filter}&${order}&${rows}&`)
    const resp = await promisePool.submit(() => fetch(url))

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

export function crossrefToRsdType(type: string): MentionTypeKeys {
  if (!type) return 'other'
  switch (type.trim().toLowerCase()) {
    case 'book':
    case 'book-set':
    case 'book-series':
    case 'book-track':
    case 'edited-book':
    case 'reference-book':
      return 'book'
    case 'book-part':
    case 'book-chapter':
    case 'book-section':
      return 'bookSection'
    case 'conference-paper':
    case 'proceedings-series':
    case 'proceedings-article':
    case 'proceedings':
      return 'conferencePaper'
    case 'dissertation':
      return 'thesis'
    case 'dataset':
      return 'dataset'
    // n/a
    // case 'interview':
    //   return 'interview'
    case 'journal':
    case 'journal-article':
    case 'journal-volume':
    case 'journal-issue':
    case 'journal article':
      return 'journalArticle'
    // n/a
    // case 'magazine-article':
    //   return 'magazineArticle'
    // case 'newspaper-article':
    //   return 'newspaperArticle'
    case 'presentation':
      return 'presentation'
    case 'report-series':
    case 'report':
      return 'report'
    case 'software':
    case 'computer-program':
      return 'computerProgram'
    // n/a
    // case 'video-recording':
    //   return 'videoRecording'
    // case 'webpage':
    //   return 'webpage'
    default:
      return 'other'
  }
}
