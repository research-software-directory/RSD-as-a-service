// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
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
  organisation_slug: string[]
}

export type SoftwareReleasedByYear = {
  [key: string]: SoftwareReleaseInfo[]
}

type UseSoftwareReleaseProps = {
  organisation_slug: string,
  token: string
}


function softwareReleaseByYear(data: SoftwareReleaseInfo[]) {
  const releaseByYear:SoftwareReleasedByYear = {}

  data.forEach(item => {
    if (releaseByYear.hasOwnProperty(item.release_year.toString())===false) {
      // create new key
      releaseByYear[item.release_year.toString()] = []
    }
    // parse info
    // item.release_info = JSON.parse(item.release_info)
    releaseByYear[item.release_year.toString()].push(item)
  })

  return releaseByYear
}

async function getReleasesForOrganisation({organisation_slug, token}:UseSoftwareReleaseProps) {
  try {
    const query = `organisation_slug=cs.{${organisation_slug}}&order=release_date.desc`
    const url = `${getBaseUrl()}/rpc/software_release?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })

    if (resp.status === 200) {
      const data:SoftwareReleaseInfo[] = await resp.json()
      return softwareReleaseByYear(data)
    }
    // some other errors
    logger(`getReleasesForOrganisation...${resp.status} ${resp.statusText}`)
    return null
  } catch(e:any) {
    logger(`getReleasesForOrganisation...error...${e.message}`)
    return null
  }
}

export default function useSoftwareRelease({organisation_slug, token}:UseSoftwareReleaseProps) {
  const [loading, setLoading] = useState(true)
  const [releases, setReleases] = useState<SoftwareReleasedByYear>()


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
      const releases = await getReleasesForOrganisation({organisation_slug, token})
      // update releases
      if (releases) setReleases(releases)
      setLoading(false)
    }

    if (organisation_slug) {
      getReleases()
    }

  },[organisation_slug,token])

  return {
    loading,
    releases
  }
}
