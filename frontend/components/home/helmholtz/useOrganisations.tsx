// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

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


export default function useOrganisations(token:string) {
  const [organisations, setOrganisations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getData() {
      setLoading(true)
      const url = '/api/v1/rpc/organisations_overview?parent=is.null'
      const {data} = await getOrganisationsList({url, token})
      if (abort) return
      setOrganisations(data)
      setLoading(false)
    }
    getData()
    return () => { abort = true }
  }, [token])

  return {
    loading,
    organisations
  }
}
