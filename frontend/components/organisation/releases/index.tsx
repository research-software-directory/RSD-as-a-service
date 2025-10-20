// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import NoContent from '~/components/layout/NoContent'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {getOrganisationIdForSlug} from '../apiOrganisations'
import {getReleasesCountForOrganisation, getReleasesForOrganisation} from './apiOrganisationReleases'
import ReleaseList from './ReleaseList'
import SelectReleaseYear from './SelectReleaseYear'
import ScrollToTopButton from './ScrollToTopButton'

type SoftwareReleasesProps = Readonly<{
  slug: string[],
  query: {[key: string]: string | undefined}
}>

export default async function SoftwareReleases({slug,query}: SoftwareReleasesProps) {
  // extract params, user preferences and active modules
  const [{token},modules] = await Promise.all([
    getUserSettings(),
    getActiveModuleNames()
  ])
  // show 404 page if module is not enabled or slug is missing
  if (
    modules?.includes('organisations')===false ||
    slug.length === 0
  ){
    notFound()
  }
  // resolve slug to organisation id
  const uuid = await getOrganisationIdForSlug({slug, token})
  // show 404 page if organisation id missing
  if (uuid === undefined || uuid === null) {
    notFound()
  }
  const releaseCountsByYear = await getReleasesCountForOrganisation({
    organisation_id: uuid,
    token
  })

  // get selected release year
  let queryYear:string|undefined
  if (query['year']){
    queryYear = query['year']
  }else if (releaseCountsByYear.length > 0){
    queryYear = releaseCountsByYear[0]?.release_year.toString()
  }

  const releases = await getReleasesForOrganisation({
    organisation_id: uuid,
    release_year: queryYear,
    token
  })

  // console.group('SoftwareReleases')
  // console.log('releaseCountsByYear...', releaseCountsByYear)
  // console.log('queryYear...', queryYear)
  // console.log('releases...', releases)
  // console.groupEnd()

  if (releaseCountsByYear.length === 0) return <NoContent />

  // releases per year
  return (
    <BaseSurfaceRounded className="flex-1 flex flex-col mb-12 py-4 px-8">
      <SelectReleaseYear
        releaseCountsByYear={releaseCountsByYear}
        queryYear={queryYear}
      />
      {/* Release items of selected year */}
      <ReleaseList release_year={queryYear} releases={releases} />
      <ScrollToTopButton minOffset={200} />
    </BaseSurfaceRounded>
  )
}
