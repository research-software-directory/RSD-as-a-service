// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useOrganisationContext from '../context/useOrganisationContext'

import ReleaseList from './ReleaseList'
import ReleaseNavButton from './ReleaseNavButton'
import ScrollToTopButton from './ScrollToTopButton'
import useReleaseCount from './useReleaseCount'

export default function SoftwareReleases() {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {loading, countsByYear} = useReleaseCount({
    organisation_id: id,
    token
  })
  const [selected_year,setSelected]=useState<number>()
  // const release_year = router.query['release_year']
  // console.group('SoftwareReleases')
  // console.log('loading...', loading)
  // console.log('releases...', releases)
  // console.log('years...', years)
  // console.log('countsByYear...', countsByYear)
  // console.groupEnd()

  useEffect(() => {
    if (countsByYear && countsByYear.length > 0) {
      setSelected(countsByYear[0].release_year)
    }
  },[countsByYear])

  // show loader
  if (loading === true) return <ContentLoader />
  if (countsByYear?.length === 0) return <NoContent />

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
              selected = {selected_year===count.release_year}
              onSelectYear={setSelected}
            />
          })
        }
      </nav>
      {/* Release items of selected year */}
      <ReleaseList release_year={selected_year} />
      <ScrollToTopButton minOffset={200} />
    </BaseSurfaceRounded>
  )
}
