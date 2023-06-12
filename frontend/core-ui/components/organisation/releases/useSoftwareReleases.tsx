// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type SoftwareReleaseInfo = {
  software_id: string
  software_slug: string
  software_name: string
  release_doi: string
  release_tag: string | null
  release_date: string
  release_year: number
  release_authors: string
}

export type ReleaseCountByYear = {
  release_year: number
  release_cnt: number
}

type UseSoftwareReleaseProps = {
  organisation_id: string,
  release_year?: string,
  token: string
}

async function getReleasesForOrganisation({organisation_id,release_year,token}:UseSoftwareReleaseProps) {
  try {
    const query = `organisation_id=eq.${organisation_id}&release_year=eq.${release_year}&order=release_date.desc`
    const url = `${getBaseUrl()}/rpc/releases_by_organisation?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })

    if (resp.status === 200) {
      const data:SoftwareReleaseInfo[] = await resp.json()
      return data
    }
    // some other errors
    logger(`getReleasesForOrganisation...${resp.status} ${resp.statusText}`)
    return null
  } catch(e:any) {
    logger(`getReleasesForOrganisation...error...${e.message}`)
    return null
  }
}

export default function useSoftwareRelease({organisation_id,release_year,token}:UseSoftwareReleaseProps) {
  const [loading, setLoading] = useState(true)
  const [releases, setReleases] = useState<SoftwareReleaseInfo[]>([])

  // console.group('useSoftwareRelease')
  // console.log('loading...', loading)
  // console.log('releases...', releases)
  // console.log('organisation_slug...', organisation_slug)
  // console.log('token...', token)
  // console.groupEnd()

  useEffect(() => {
    async function getReleases() {
      setLoading(true)
      // make request
      const releases = await getReleasesForOrganisation({organisation_id,release_year,token})
      // update releases
      if (releases) setReleases(releases)
      // set loading is done
      setLoading(false)
    }

    if (organisation_id && release_year) {
      getReleases()
    }

  },[organisation_id,release_year,token])

  return {
    loading,
    releases
  }
}
