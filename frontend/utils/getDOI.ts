// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {crossrefItemToMentionItem, getCrossrefItemByDoi} from './getCrossref'
import {dataCiteGraphQLItemToMentionItem, getDataciteItemsByDoiGraphQL} from './getDataCite'
import logger from './logger'

type DoiRA = {
  DOI: string,
  RA: string
}

export async function getDoiRA(doi: string) {
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

export async function getUrlFromDoiOrg(doi: string) {
  try {
    const url = ` https://doi.org/api/handles/${encodeURIComponent(doi)}?type=URL`
    const resp = await fetch(url)
    // debugger
    if (resp.status === 200) {
      const json: DoiUrlResponse = await resp.json()
      // extract
      if (json.values.length > 0) {
        const item = json.values[0]
        if (item.type.toLowerCase() === 'url') {
          return item.data.value
        }
      }
    }
  } catch (e: any) {
    logger(`getUrlFromDoiOrg: ${e?.message}`, 'error')
  }
}


async function getItemFromCrossref(doi: string) {
  const resp = await getCrossrefItemByDoi(doi)
  // debugger
  if (resp.status === 200) {
    const mention = crossrefItemToMentionItem(resp.message)
    return {
      status: 200,
      message: mention
    }
  }
  // return error message
  return resp
}

async function getItemFromDatacite(doi: string) {
  const resp = await getDataciteItemsByDoiGraphQL(doi)

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

export async function getMentionByDoi(doi: string) {
  // get RA first
  const doiRA = await getDoiRA(doi)
  // debugger
  if (doiRA && doiRA.RA) {
    switch (doiRA.RA.toLowerCase()) {
      case 'crossref':
        // get from crossref
        return getItemFromCrossref(doi)
      case 'datacite':
        // get from datacite
        return getItemFromDatacite(doi)
      default:
        return {
          status: 400,
          message: `${doiRA.RA} not supported. RSD supports Crossref and DataCite api`
        }
    }
  }
  return {
    status: 400,
    message: `Failed to retereive information for DOI: ${doi}. Check DOI value.`
  }
}

// This url will always redirect to the current url
export function makeDoiRedirectUrl(doi: string) {
  // we need to encode doi because it allows lot of
  // "exotic" values like 10.1175/1520-0469(2003)60%3C1201:ALESIS%3E2.0.CO;2
  return `https://doi.org/${encodeURIComponent(doi)}`
}

const exampleUrlResponse = {
  'responseCode': 1,
  'handle': '10.5281/zenodo.3401363',
  'values': [
    {
      'index': 1,
      'type': 'URL',
      'data': {
        'format': 'string',
        'value': 'https://zenodo.org/record/3401363'
      },
      'ttl': 86400,
      'timestamp': '2019-09-06T13:29:11Z'
    }
  ]
}

type DoiUrlResponse = typeof exampleUrlResponse
