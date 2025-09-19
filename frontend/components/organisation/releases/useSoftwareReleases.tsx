// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {SoftwareReleaseInfo, getReleasesForOrganisation} from './apiOrganisationReleases'


export type UseSoftwareReleaseProps = {
  organisation_id?: string,
  release_year?: string,
  token?: string
}


export default function useSoftwareRelease({organisation_id,release_year,token}:UseSoftwareReleaseProps) {
  const [loading, setLoading] = useState(true)
  const [releases, setReleases] = useState<SoftwareReleaseInfo[]>([])

  // console.group('useSoftwareRelease')
  // console.log('loading...', loading)
  // console.log('organisation_id...', organisation_id)
  // console.log('releases...', releases)
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
