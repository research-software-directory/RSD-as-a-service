// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

/**
 * Example of actual request to api with error handling and logging
 * @param param0
 * @returns
 */
async function getKeywordList({url, token}: {url: string, token?: string}) {
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if ([200, 206].includes(resp.status)) {
      const json = await resp.json()
      return {
        data: json
      }
    }
    // otherwise request failed
    logger(`getKeywordList failed: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      data: []
    }
  } catch (e: any) {
    logger(`getKeywordList: ${e?.message}`, 'error')
    return {
      data: []
    }
  }
}

export type keyword = {
  keyword: string
}

/**
 * Custom react hook to fetch any additional data
 * needed for the custom Imperial College homepage
 */
export default function useImperialData(token: string) {
  const [keywords, setKeywords] = useState<keyword[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getData() {
      setLoading(true)

      const url = '/api/v1/rpc/keyword_count_for_software'
      const {data} = await getKeywordList({url, token})

      if (abort) return

      setKeywords(data)
      setLoading(false)
    }

    getData()

    return () => { abort = true }
  }, [token])

  return {
    keywords,
    loading
  }
}
