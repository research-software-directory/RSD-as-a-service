// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import NoContent from '~/components/layout/NoContent'
import ReleaseItem from './ReleaseItem'
import useSoftwareRelease from './useSoftwareReleases'
import useOrganisationContext from '../context/useOrganisationContext'

type ReleaseYearProps = {
  organisation_id?: string
  release_year?: number
}

const smoothScrollSection = {
  padding: '0.5rem 0rem',
  // TODO! make this dynamic - for mobiles
  scrollMarginTop: '7rem'
}

export default function ReleaseList({release_year}: ReleaseYearProps) {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {releases} = useSoftwareRelease({
    organisation_id: id,
    release_year: release_year?.toString(),
    token
  })

  // console.group('ReleaseList')
  // console.log('id...', id)
  // console.log('release_year...', release_year)
  // console.log('releases...', releases)
  // console.groupEnd()

  // show loader
  // if (loading===true) return <ContentLoader />
  if (typeof releases === 'undefined') return <NoContent />

  return (
    <section id={`id_${release_year}`} style={smoothScrollSection}>
      <div>
        <h3 className="text-primary">
          {release_year}
        </h3>
        <div className="pb-2 text-sm text-base-content-secondary">
          {releases.length} {releases.length === 1 ? 'release' : 'releases'}
        </div>
      </div>

      {releases.map((release,pos)=><ReleaseItem key={release.release_doi ?? pos} release={release} />)}

    </section>
  )
}
