// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'
import {crossrefItemToMentionItem} from './getCrossref'
import {
  dataCiteGraphQLItemToMentionItem,
  getDataciteItemByDoiGraphQL,
  getDataciteItemsByDoiGraphQL
} from './getDataCite'
import logger from './logger'
import {getOpenalexItemByDoi, getOpenalexItemsByDoi, openalexItemToMentionItem} from '~/utils/getOpenalex'


type DoiRA = {
  DOI: string,
  // not returned if invalid DOI
  RA?: string
}

async function getDoiRA(doi: string) {
  try {
    const url = `https://doi.org/doiRA/${doi}`
    const resp = await fetch(url)
    // debugger
    if (resp.status === 200) {
      const json: DoiRA[] = await resp.json()
      // extract
      if (json.length > 0) {
        return json[0]
      }
    }
  } catch (e: any) {
    logger(`getDoiRA: ${e?.message}`, 'error')
  }
}

export async function getDoiRAList(doiList: string[]) {
  try {
    const query = doiList.map(item => encodeURIComponent(item)).join(',')
    const url = `https://doi.org/doiRA/${query}`
    const resp = await fetch(url)
    // debugger
    if (resp.status === 200) {
      const json: DoiRA[] = await resp.json()
      // extract
      return json
    }
    logger(`getDoiRAList failed ${resp.status} ${resp.statusText}`)
    return []
  } catch (e: any) {
    logger(`getDoiRAList: ${e?.message}`, 'error')
    return []
  }
}


async function getItemFromCrossref(doi: string) {
  const mentionResponse = await fetch(`/api/fe/mention/crossref?doi=${doi}`)
  const resp = await mentionResponse.json()
  // debugger
  if (resp.status === 200) {
    try {
      const mention = crossrefItemToMentionItem(resp.message)
      return {
        status: 200,
        message: mention
      }
    } catch (e: any) {
      return {
        status: 400,
        message: e?.message ?? `Unknown error when parsing Crossref mention with DOI ${doi}`
      }
    }
  }
  // return error message
  return resp
}

export async function getItemsFromCrossref(dois: string[]) {
  if (dois.length === 0) return []

  // debugger
  const mentions: MentionItemProps[] = []
  // The Crossref API has a rate limit of 50 requests per second.
  // We will make 40 requests per second to be on the save side.
  const amountOfBatches = Math.ceil(dois.length / 40)
  // An array of promises that resolve when all requests have resolved
  const promises: Promise<void>[] = []

  for (let batch = 0; batch < amountOfBatches; batch++) {
    const lowerIndex = batch * 40
    const upperIndex = Math.min((batch + 1) * 40, dois.length)
    for (let index = lowerIndex; index < upperIndex; index++) {
      const doi = dois[index]
      const promise = new Promise((res) => {
        setTimeout(res, 1000 * batch)
      }).then(async () => {
        const mentionResult = await getItemFromCrossref(doi)
        if (mentionResult.status === 200) {
          mentions.push(mentionResult.message)
        }
      })

      promises.push(promise)
    }
  }

  await Promise.allSettled(promises)

  return mentions
}

async function getItemFromDatacite(doi: string) {
  const resp = await getDataciteItemByDoiGraphQL(doi)

  if (resp.status === 200) {
    const mention = dataCiteGraphQLItemToMentionItem(resp.message)
    return {
      status: 200,
      message: mention
    }
  }
  // return error message
  return resp
}

export async function getItemsFromDatacite(dois: string[]) {
  const mentions: MentionItemProps[] = []
  if (dois.length === 0) {
    return mentions
  }
  const resp = await getDataciteItemsByDoiGraphQL(dois)

  if (resp.status === 200) {
    for (const dataciteMention of resp.message) {
      const mention = dataCiteGraphQLItemToMentionItem(dataciteMention)
      mentions.push(mention)
    }
    return mentions
  }
  // return error message
  // return resp
  logger(`getItemsFromDatacite...failed...${resp.status} ${resp.message}`)
  return mentions
}

async function getItemFromOpenalex(doi: string) {
  const resp = await getOpenalexItemByDoi(doi)
  // debugger
  if (resp.status === 200) {
    const mention = openalexItemToMentionItem(resp.message)
    return {
      status: 200,
      message: mention
    }
  }
  // return error message
  return resp
}

export async function getItemsFromOpenAlex(dois: string[]): Promise<MentionItemProps[]> {
  if (dois.length === 0) {
    return []
  }

  const response = await getOpenalexItemsByDoi(dois)

  return response.message.map((rawMention: any) => openalexItemToMentionItem(rawMention))
}

export async function getMentionByDoi(doi: string) {
  // get RA first
  const doiRA = await getDoiRA(doi)
  // debugger
  if (doiRA && doiRA.RA) {
    switch (doiRA.RA.toLowerCase()) {
      case 'crossref':
        return getItemFromCrossref(doi)
      case 'datacite':
        return getItemFromDatacite(doi)
      case 'invalid doi':
      case 'doi does not exist':
      case 'unknown':
        return {
          status: 400,
          message: 'Invalid or unknown DOI'
        }
      default:
        return getItemFromOpenalex(doi)
    }
  }
  return {
    status: 400,
    message: `Failed to retrieve information for DOI: ${doi}. Check DOI value.`
  }
}

// This url will always redirect to the current url
export function makeDoiRedirectUrl(doi: string) {
  // we need to encode doi because it allows a lot of
  // "exotic" values like 10.1175/1520-0469(2003)60%3C1201:ALESIS%3E2.0.CO;2
  return `https://doi.org/${encodeURIComponent(doi)}`
}

