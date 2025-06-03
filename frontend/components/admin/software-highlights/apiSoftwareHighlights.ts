// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {localeSort} from '~/utils/sortFn'

export type SoftwareHighlight = SoftwareOverviewItemProps & {
  position: number | null
}

type getHighlightsApiParams = {
  limit?: number
  offset?: number
  token?: string,
  searchFor?: string
  orderBy?: string,
  keywords?: string[] | null
}

export async function getSoftwareHighlights({limit, offset, token, searchFor, orderBy, keywords}:getHighlightsApiParams) {
  try {
    // let query = paginationUrlParams({ rows, page })
    let query = ''
    if (searchFor) {
      query+=`&or=(brand_name.ilike."*${searchFor}*",short_statement.ilike."*${searchFor}*")`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=position.asc,brand_name.asc'
    }
    if (limit) {
      query+=`&limit=${limit}`
    }
    if (offset) {
      query+=`&offset=${offset}`
    }
    if (typeof keywords !== 'undefined' &&
    keywords !== null &&
    typeof keywords === 'object') {
    // sort and convert keywords array to comma separated string
    // we need to sort because search is on ARRAY field in pgSql
    // and all keywords should be present (AND).
    // and it needs to be enclosed in {} uri encoded see
    // https://postgrest.org/en/v9.0/api.html?highlight=filter#calling-functions-with-array-parameters
      const keywordsAll = [...keywords].sort(localeSort).map((item: string) => `"${encodeURIComponent(item)}"`).join(',')
      // use cs. command to find
      query += `&keywords=cs.%7B${keywordsAll}%7D`
    }
    // complete url
    const url = `${getBaseUrl()}/rpc/software_for_highlight?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      },
    })

    if ([200,206].includes(resp.status)) {
      const highlights: SoftwareHighlight[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        highlights
      }
    }
    logger(`getSoftwareHighlights: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      highlights: []
    }

  } catch (e: any) {
    logger(`getSoftwareHighlights: ${e?.message}`, 'error')
    return {
      count: 0,
      highlights: []
    }
  }
}

export async function addSoftwareHighlight({id,position,token}:{id:string,position:number,token:string}) {
  try {
    const resp = await fetch('/api/v1/software_highlight', {
      body: JSON.stringify({
        software: id,
        position
      }),
      headers: createJsonHeaders(token),
      method: 'POST'
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function patchSoftwareHighlights({highlights,token}:{highlights:SoftwareHighlight[],token:string}) {
  try {
    // create all requests
    const requests = highlights.map(item => {
      const url = `/api/v1/software_highlight?software=eq.${item.id}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: item.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchSoftwareHighlights: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteSoftwareHighlight({id,token}:{id: string, token:string}) {
  try {
    const query = `software=eq.${id}`
    const url = `${getBaseUrl()}/software_highlight?${query}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    return {
      status: 500,
      message: e.message
    }
  }
}

