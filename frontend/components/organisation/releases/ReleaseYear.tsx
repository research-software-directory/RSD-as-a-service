// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ReleaseItem from './ReleaseItem'
import {SoftwareReleaseInfo} from './useSoftwareReleases'

type ReleaseYearProps = {
  year: string,
  releases: SoftwareReleaseInfo[]
}

const smoothScrollSection = {
  padding: '0.5rem 0rem',
  // TODO! make this dynamic - for mobiles
  scrollMarginTop: '7rem'
}


export default function ReleaseYear({year,releases}:ReleaseYearProps) {
  return (
    <section id={`id_${year}`} style={smoothScrollSection}>
      <div>
        <h3 className="text-primary">
          {year}
        </h3>
        <div className="pb-2 border-b text-sm text-base-content-secondary">
          {releases.length} {releases.length === 1 ? 'release' : 'releases'}
        </div>
      </div>
      <section>
        {releases.map(release=><ReleaseItem key={release.release_doi} release={release} />)}
      </section>
    </section>
  )
}
