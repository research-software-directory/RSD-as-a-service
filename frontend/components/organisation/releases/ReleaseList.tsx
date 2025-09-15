// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import NoContent from '~/components/layout/NoContent'
import ReleaseItem from './ReleaseItem'
import {SoftwareReleaseInfo} from '~/components/organisation/releases/apiOrganisationReleases'

type ReleaseYearProps = Readonly<{
  release_year?: string
  releases: SoftwareReleaseInfo[]
}>

const smoothScrollSection = {
  padding: '0.5rem 0rem',
  // TODO! make this dynamic - for mobiles
  scrollMarginTop: '7rem'
}

export default function ReleaseList({release_year, releases}: ReleaseYearProps) {
  // console.group('ReleaseList')
  // console.log('id...', id)
  // console.log('release_year...', release_year)
  // console.log('releases...', releases)
  // console.groupEnd()

  if (releases.length === 0) return <NoContent />

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

      {releases.map((release,pos)=><ReleaseItem key={pos} release={release} />)}

    </section>
  )
}
