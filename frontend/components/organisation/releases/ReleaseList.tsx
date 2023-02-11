// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import ReleaseItem from './ReleaseItem'
import useSoftwareRelease from './useSoftwareReleases'

type ReleaseYearProps = {
  organisation_id: string
}

const smoothScrollSection = {
  padding: '0.5rem 0rem',
  // TODO! make this dynamic - for mobiles
  scrollMarginTop: '7rem'
}


export default function ReleaseList({organisation_id}: ReleaseYearProps) {
  const router = useRouter()
  const {token} = useSession()
  const release_year = router.query['release_year']?.toString()
  const {loading, releases} = useSoftwareRelease({
    organisation_id,
    release_year,
    token
  })

  // show loader
  if (loading===true) return <ContentLoader />
  if (typeof releases === 'undefined') return <NoContent />

  return (
    <section id={`id_${release_year}`} style={smoothScrollSection}>
      <div>
        <h3 className="text-primary">
          {release_year}
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
