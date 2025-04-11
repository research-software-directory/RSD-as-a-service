// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'

import ReleaseList from './ReleaseList'
import ReleaseNavButton from './ReleaseNavButton'
import ScrollToTopButton from './ScrollToTopButton'
import {ReleaseCountByYear, SoftwareReleaseInfo} from '~/components/organisation/releases/apiOrganisationReleases'
import {useRouter} from 'next/router'

type SoftwareReleasesProps = {
  releaseCountsByYear: ReleaseCountByYear[] | null
  releases: SoftwareReleaseInfo[] | null
}

export default function SoftwareReleases({releaseCountsByYear: countsByYear, releases}: Readonly<SoftwareReleasesProps>) {
  const router = useRouter()
  // console.group('SoftwareReleases')
  // console.log('loading...', loading)
  // console.log('releases...', releases)
  // console.log('years...', years)
  // console.log('countsByYear...', countsByYear)
  // console.groupEnd()

  if (!countsByYear || countsByYear.length === 0) return <NoContent />

  const queryYear = router.query['year']
  let release_year: number = parseInt(queryYear as string)
  if (isNaN(release_year)) {
    release_year = countsByYear[0].release_year
  }

  const path = router.asPath
  const newPath = path.split('?')[0] + '?tab=releases'

  // releases per year
  return (
    <BaseSurfaceRounded className="flex-1 flex flex-col mb-12 p-4">
      <h2 className="pt-4">Releases per year</h2>
      <nav id="period_nav"
        className="flex flex-wrap justify-start items-center my-4"
        style={{gap: '0.5rem 0.25rem'}}>
        {countsByYear && countsByYear
          .map(count => {
            return <ReleaseNavButton
              key={count.release_year}
              year={count.release_year}
              release_cnt={count.release_cnt}
              selected = {release_year===count.release_year}
              link={newPath + `&year=${count.release_year}`}
            />
          })
        }
      </nav>
      {/* Release items of selected year */}
      <ReleaseList release_year={release_year} releases={releases ?? []} />
      <ScrollToTopButton minOffset={200} />
    </BaseSurfaceRounded>
  )
}
