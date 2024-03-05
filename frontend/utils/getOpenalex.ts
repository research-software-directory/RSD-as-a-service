// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {MentionItemProps} from '~/types/Mention'
import {crossrefToRsdType} from '~/utils/getCrossref'

export async function getOpenalexItemByDoi(doi: string) {
  try {
    const url = `https://api.openalex.org/works/https://doi.org/${doi}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json = await resp.json()
      return ({
        status: 200,
        message: json
      })
    }
    else if (resp.status === 404) {
      return {
        status: 404,
        message: 'DOI not found'
      }
    }
    else {
      return ({
        status: resp.status,
        message: 'unexpected response from OpenAlex'
      })
    }
  } catch (e:any) {
    logger(`getOpenalexItemByDoi: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getOpenalexItemsByDoi(dois: string[]) {
  try {
    const url = `https://api.openalex.org/works?filter=doi:${dois.join('|')}`

    const resp = await fetch(url)

    if (resp.status === 200) {
      const json = await resp.json()
      return ({
        status: 200,
        message: json.results
      })
    }
    else {
      return ({
        status: resp.status,
        message: 'unexpected response from OpenAlex'
      })
    }
  } catch (e:any) {
    logger(`getOpenalexItemByDoi: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export function openalexItemToMentionItem(json: any): MentionItemProps {
  return ({
    id: null,
    doi: json.doi.substring('https://doi.org/'.length),
    url: json.doi,
    title: json.title,
    authors: extractAuthors(json),
    publisher: null,
    publication_year: json.publication_year,
    journal: null,
    page: null,
    // url to external image
    image_url: null,
    // is_featured?: boolean
    mention_type: crossrefToRsdType(json.type_crossref),
    source: 'OpenAlex',
    note: null
  })
}

function extractAuthors(json: any): string {
  return json.authorships.map((authorship: any) => authorship.raw_author_name as string).join(', ')
}
