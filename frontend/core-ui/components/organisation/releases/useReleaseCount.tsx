// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type ReleaseCountByYear = {
  release_year: number
  release_cnt: number
}

type UseSoftwareReleaseProps = {
  organisation_id: string,
  token: string
}

async function getReleasesCountForOrganisation({organisation_id, token}:UseSoftwareReleaseProps) {
  try {
    const query = `organisation_id=${organisation_id}&order=release_year.desc`
    const url = `${getBaseUrl()}/rpc/release_cnt_by_year?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })

    if (resp.status === 200) {
      const data:ReleaseCountByYear[] = await resp.json()
      return data
    }
    // some other errors
    logger(`getReleasesCountForOrganisation...${resp.status} ${resp.statusText}`)
    return null
  } catch(e:any) {
    logger(`getReleasesCountForOrganisation...error...${e.message}`)
    return null
  }
}

export default function useReleaseCount({organisation_id, token}:UseSoftwareReleaseProps) {
  const [loading, setLoading] = useState(true)
  const [countsByYear, setCountsByYear] = useState<ReleaseCountByYear[]>()

  // console.group('useReleaseCount')
  // console.log('loading...', loading)
  // console.log('countsByYear...', countsByYear)
  // console.groupEnd()

  useEffect(() => {
    async function getReleases() {
      setLoading(true)
      // make request
      const countByYear = await getReleasesCountForOrganisation({organisation_id, token})
      // update counts by year
      if (countByYear) setCountsByYear(countByYear)
      // set loading is done
      setLoading(false)
    }

    if (organisation_id) {
      getReleases()
    }

  },[organisation_id,token])

  return {
    loading,
    countsByYear
  }
}
