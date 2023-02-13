// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {useRouter} from 'next/router'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import {OrganisationComponentsProps} from '../OrganisationNavItems'
import ReleaseYear from './ReleaseList'
import ReleaseNavButton from './ReleaseNavButton'
import ScrollToTopButton from './ScrollToTopButton'
import useReleaseCount from './useReleaseCount'

export default function SoftwareReleases({organisation, isMaintainer}: OrganisationComponentsProps) {
  const {token} = useSession()
  const router = useRouter()
  const {loading, countsByYear} = useReleaseCount({
    organisation_id: organisation.id,
    token
  })
  const release_year = router.query['release_year']

  // console.group('SoftwareReleases')
  // console.log('loading...', loading)
  // console.log('releases...', releases)
  // console.log('years...', years)
  // console.log('countsByYear...', countsByYear)
  // console.groupEnd()

  useEffect(() => {
    if (countsByYear &&
      countsByYear.length > 0 &&
      typeof release_year === 'undefined') {
      // only if no release_year query param
      router.push({
        query: {
          ...router.query,
          release_year: countsByYear[0].release_year
        }
      })
    }
  // we ignore router dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[countsByYear,release_year])

  // show loader
  if (loading === true) return <ContentLoader />
  if (countsByYear?.length === 0) return <NoContent />

  // releases per year
  return (
    <>
      <h2 className="pt-4">Releases per year</h2>
      <nav id="period_nav"
        className="flex flex-wrap justify-start items-center my-4"
        style={{gap: '0.5rem 0.25rem'}}>
        {countsByYear && countsByYear
          .map(count => {
            return <ReleaseNavButton
              key={count.release_year}
              year={count.release_year.toString()}
              release_cnt={count.release_cnt} />
          })
        }
      </nav>
      {/* Release items of selected year */}
      <ReleaseYear organisation_id={organisation.id} />
      <ScrollToTopButton minOffset={200} />
    </>
  )
}
