// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

export type SoftwareHighlight = SoftwareListItem & {
  position: number | null
}

type getHighlightsApiParams = {
  page: number
  rows: number
  token?: string,
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
    const {highlights, count} = await getSoftwareHighlights({
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
    const resp = await addSoftwareHighlight({
      id,
      position: highlights.length + 1,
      token
    })

    if (resp.status !== 200) {
      showErrorMessage(`Failed to add software to highlight. ${resp.message}`)
    } else {
      await loadHighlight()
    }
  }

  async function deleteHighlight(id: string) {
    const resp = await deleteSoftwareHighlight({
      id,
      token
    })

    if (resp.status !== 200) {
      showErrorMessage(`Failed to remove highlight. ${resp.message}`)
    } else {
      // remove item and renumber positions
      const newList = highlights
        .filter(item => item.id !== id)
        .map((item, pos) => {
          // renumber
          item.position = pos + 1
          return item
        })
      // update position in db
      if (newList.length > 0) {
        await sortHighlights(newList)
      } else {
        // we do not have highlights left
        setHighlights([])
      }
    }
  }

  async function sortHighlights(items: SoftwareHighlight[]) {
    // visually confirm position change
    setHighlights(items)
    // make all request
    const resp = await patchSoftwareHighlights({
      highlights: items,
      token
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to sort highlight. ${resp.message}`)
      // revert back in case of error
      setHighlights(highlights)
    }
  }

  return {
    count,
    loading,
    highlights,
    addHighlight,
    sortHighlights,
    deleteHighlight
  }
}

export async function getSoftwareHighlights({page, rows, token, searchFor,orderBy}:getHighlightsApiParams) {
  try {
    // let query = paginationUrlParams({ rows, page })
    let query = ''
    if (searchFor) {
      query+=`&or=(brand_name.ilike.*${searchFor}*,short_statement.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=position.asc,brand_name.asc'
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
    return {
      count: 0,
      highlights: []
    }
  }
}

async function addSoftwareHighlight({id,position,token}:{id:string,position:number,token:string}) {
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

async function patchSoftwareHighlights({highlights,token}:{highlights:SoftwareHighlight[],token:string}) {
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

