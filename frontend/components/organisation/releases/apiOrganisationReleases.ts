// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {UseSoftwareReleaseProps} from './useSoftwareReleases'

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

export async function getReleasesForOrganisation({organisation_id, release_year, token}: UseSoftwareReleaseProps) {
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
      const data: SoftwareReleaseInfo[] = await resp.json()
      return data
    }
    // some other errors
    logger(`getReleasesForOrganisation...${resp.status} ${resp.statusText}`,'warn')
    return []
  } catch (e: any) {
    logger(`getReleasesForOrganisation...error...${e.message}`,'error')
    return []
  }
}

export async function getReleasesCountForOrganisation({organisation_id, token}: UseSoftwareReleaseProps) {
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
      const data: ReleaseCountByYear[] = await resp.json()
      return data
    }
    // some other errors
    logger(`getReleasesCountForOrganisation...${resp.status} ${resp.statusText}`,'warn')
    return []
  } catch (e: any) {
    logger(`getReleasesCountForOrganisation...error...${e.message}`,'error')
    return []
  }
}
