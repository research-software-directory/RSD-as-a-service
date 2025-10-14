// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {UseSoftwareReleaseProps} from '../useSoftwareReleases'

import mockReleasesForOrganisation from './releases_by_organisation.json'
import mockReleaseCntByYear from './release_cnt_by_year.json'

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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getReleasesForOrganisation=jest.fn(({organisation_id, release_year, token}: UseSoftwareReleaseProps)=>{
  // console.log('getReleasesForOrganisation...default MOCK')
  return Promise.resolve(mockReleasesForOrganisation)
})


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getReleasesCountForOrganisation=jest.fn(async({organisation_id, token}: UseSoftwareReleaseProps)=>{
  // console.log('getReleasesCountForOrganisation...default MOCK')
  return mockReleaseCntByYear
})
