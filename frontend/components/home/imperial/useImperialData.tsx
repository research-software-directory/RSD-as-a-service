// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {OrganisationForOverview} from '~/types/Organisation'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

/**
 * Example of actual request to api with error handling and logging
 * @param param0
 * @returns
 */
async function getOrganisationsList({url, token}: {url: string, token?: string}) {
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
    logger(`getOrganisationsList failed: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      data: []
    }
  } catch (e: any) {
    logger(`getOrganisationsList: ${e?.message}`, 'error')
    return {
      data: []
    }
  }
}

/**
 * Custom react hook to fetch any additional data
 * needed for the custom Imperial College homepage
 */
export default function useImperialData(token: string) {
  const [organisations, setOrganisations] = useState<OrganisationForOverview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    // async function to collect data
    async function getData() {
      setLoading(true)
      // construct api url with all params
      const url = '/api/v1/rpc/organisations_overview?parent=is.null&limit=1'
      // pass it to async api call function
      const {data} = await getOrganisationsList({url, token})
      // if for any reason the hook is
      if (abort) return
      // set new data, this triggers rerenders on change
      setOrganisations(data)
      // set loading flag to finish
      setLoading(false)
    }
    // call async function
    getData()
    // hook clean up
    return () => { abort = true }
  }, [token])

  return {
    organisations,
    loading
  }
}
