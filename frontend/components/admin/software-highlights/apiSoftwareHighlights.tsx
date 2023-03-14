// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

export type SoftwareHighlight = {
  id:string,
	slug: string,
	brand_name: string,
	short_statement: string,
	image_id: string,
	updated_at: string,
	contributor_cnt: number,
  mention_cnt: number,
  is_published: boolean
}

type getHighlightsApiParams = {
  token: string,
  page: number
  rows: number
  searchFor?: string
  orderBy?: string
}

export function useSoftwareHighlights(token: string) {
  const {showErrorMessage} = useSnackbar()
  const {searchFor, page, rows, count, setCount} = usePaginationWithSearch('Find highlight by name')
  const [highlights, setHighlights] = useState<SoftwareHighlight[]>([])
  const [loading, setLoading] = useState(true)

  const loadHighlight = useCallback(async() => {
    setLoading(true)
    const {highlights, count} = await getHighlights({
      token,
      searchFor,
      page,
      rows
    })
    setHighlights(highlights)
    setCount(count ?? 0)
    setLoading(false)
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows])


  useEffect(() => {
    if (token) {
      loadHighlight()
    }
  }, [loadHighlight, token])

  async function addHighlight(id: string) {
    console.log('addHighlight...', id)
    const resp = await addSoftwareHighlight({
      id,
      token
    })

    if (resp.status !== 200) {
      showErrorMessage(`Failed to add software to highlight. ${resp.message}`)
    } else {
      await loadHighlight()
    }
  }

  async function deleteHighlight(id: string) {
    console.log('deleteHighlight...', id)
    const resp = await deleteSoftwareHighlight({
      id,
      token
    })

    if (resp.status !== 200) {
      showErrorMessage(`Failed to remove highlight. ${resp.message}`)
    } else {
      await loadHighlight()
    }
  }

  return {
    count,
    loading,
    highlights,
    addHighlight,
    deleteHighlight
  }
}

async function getHighlights({page, rows, token, searchFor,orderBy}:getHighlightsApiParams) {
  try {
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(brand_name.ilike.*${searchFor}*,short_statement.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=brand_name.asc'
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
    logger(`getHighlights: ${resp.status}: ${resp.statusText}`,'warn')
    return {
      count: 0,
      highlights: []
    }

  } catch (e: any) {
    return {
      count: 0,
      highlights: []
    }
  }
}

async function addSoftwareHighlight({id,token}:{id:string,token:string}) {
  try {
    const resp = await fetch('/api/v1/software_highlight', {
      body: JSON.stringify({software:id}),
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

async function deleteSoftwareHighlight({id,token}:{id: string, token:string}) {
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

