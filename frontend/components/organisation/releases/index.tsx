// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import {OrganisationComponentsProps} from '../OrganisationNavItems'
import useSoftwareRelease from './useSoftwareReleases'
import ReleaseYear from './ReleaseYear'
import NoContent from '~/components/layout/NoContent'
import ReleaseNavButton from './ReleaseNavButton'
import ScrollToTopButton from './ScrollToTopButton'

export default function SoftwareReleases({organisation, isMaintainer}: OrganisationComponentsProps) {
  const {token} = useSession()
  const {loading, releases} = useSoftwareRelease({
    organisation_slug: organisation.slug,
    token
  })
  // extact year keys in descending order
  const years = Object.keys(releases ?? {}).sort((a,b)=>parseInt(b) - parseInt(a))

  // console.group('SoftwareReleases')
  // console.log('loading...', loading)
  // console.log('releases...', releases)
  // console.log('years...', years)
  // console.groupEnd()

  // show loader
  if (loading===true) return <ContentLoader />
  // no content
  if (typeof releases === 'undefined') return <NoContent />
  if (years.length === 0) return <NoContent />
  // releases per year
  return (
    <section className="relative">
      <h2 className="py-2">Releases per year</h2>
      <nav id="period_nav"
        className="flex flex-wrap justify-start items-center mb-4"
        style={{gap: '0.5rem 0.25rem'}}>
        {years
          .map(year => {
            return <ReleaseNavButton key={year} year={year} release_cnt={releases[year].length} />
          })
        }
      </nav>
      {years
        .map(year => {
          return <ReleaseYear key={year} year={year} releases={releases[year]} />
        })}
      <ScrollToTopButton minOffset={200} />
      <div className="py-8"></div>
    </section>
  )
}
