// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import styled from '@mui/system/styled'
import {ParticipatingOrganisationProps} from '~/types/Organisation'
import ParticipatingOrganisation from '~/components/software/ParticipatingOrganisation'
import {RsdHighlightsProps} from '~/config/rsdSettingsReducer'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import Link from 'next/link'
import LatestBadge from './LatestBadge'
import HighlightsCardLogo from './HighlightsCardLogo'

type LatestHighlightProps = {
  highlightsProps: RsdHighlightsProps,
  softwareData: SoftwareListItem,
  organisations?: ParticipatingOrganisationProps[]
}

const OrganisationGridSection = styled('section')(({theme}) => ({
  flex: 1,
  display: 'grid',
  gridGap: '2rem',
  gridAutoRows: 'minmax(3rem,5rem)',
  gridTemplateColumns: 'repeat(auto-fit,minmax(5rem,13rem))'
}))


export default function LatestHighlight({highlightsProps, softwareData, organisations}: LatestHighlightProps) {
  const href = `/software/${softwareData.slug}`

  organisations?.forEach(o => {o.slug=undefined, o.rsd_path='', o.website=null})

  return (
    <Link href={href} passHref>
      <section
        className='bg-base-200 p-4 hover:bg-opacity-5 hover:bg-primary relative'
      >
      <LatestBadge/>
      <HighlightsCardLogo image_id={softwareData.image_id ?? ''} />
      <h2>{softwareData.brand_name}</h2>
      <div>{softwareData.short_statement}</div>
      <div className="py-2">
        <h3>Participating organisations</h3>
        <OrganisationGridSection>
        {organisations && organisations.map((item, pos) => {
          return (
            <ParticipatingOrganisation
              key={pos}
              {...item}
            />
          )
          })}
        </OrganisationGridSection>
      </div>
    </section>
    </Link>
  )
}
