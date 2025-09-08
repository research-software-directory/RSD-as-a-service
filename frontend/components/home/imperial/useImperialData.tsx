// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'
import logger from '~/utils/logger'

/**
 * Filters the information about the keywords such that only those used are included.
 *
 * They are also sorted by number of software that use them and the top 10 picked.
 *
 * @param jsonData The total list of keyword data to filter and sort.
 * @returns The filtered list, leaving only the top ten keywords sorted.
 */
function filterAndSortJson(jsonData: any[]): any[] {
  return jsonData
    .filter(entry => entry.cnt !== null) // Remove entries where cnt is null
    .sort((a, b) => b.cnt - a.cnt) // Sort by cnt in descending order
    .slice(0, 10) // Select only the top 10 results
}

/**
 * Example of actual request to api with error handling and logging
 * @param param0
 * @returns
 */
async function getKeywordList({url}: {url: string}) {
  try {
    const resp = await fetch(url, {
      method: 'GET'
    })

    if ([200, 206].includes(resp.status)) {
      const json = await resp.json()
      return {
        data: filterAndSortJson(json)
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
      const {data} = await getKeywordList({url})

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
