// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import LanguageIcon from '@mui/icons-material/Language'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import MapIcon from '@mui/icons-material/Map'

import RorIcon from '~/components/icons/RorIcon'
import OrganisationLogo from './OrganisationLogo'
import RorType from './RorType'
import Links, {LinksProps} from './Links'
import RorLocation from './RorLocation'
import {getHostnameFromUrl} from '~/utils/getHostname'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useOrganisationContext from '../context/useOrganisationContext'

export default function OrganisationMetadata() {
  const {
    name,short_description,country,city,website,
    isMaintainer,wikipedia_url,ror_id,ror_types
  } = useOrganisationContext()

  // console.group('OrganisationMetadata')
  // console.log('short_description...', short_description)
  // console.log('website....', website)
  // console.log('isMaintainer....', isMaintainer)
  // console.groupEnd()

  function getAllLinks() {
    const rsdLinks:LinksProps[]=[]
    if (website) {
      // extract hostname
      const title = getHostnameFromUrl(website)
      if (title) {
        // website as first link
        rsdLinks.push({
          title,
          url: website,
          icon: <LanguageIcon />,
        })
      }
    }
    // ror_id url
    if (ror_id) {
      // add only new items
      rsdLinks.push({
        title:'ROR info',
        url: ror_id,
        icon: <RorIcon/>,
      })
    }
    // some organisations provide wikipedia page
    if (wikipedia_url) {
      rsdLinks.push({
        title:'Wikipedia',
        url: wikipedia_url,
        icon: <AutoStoriesIcon />,
      })
    }
    // Google Maps link
    if (name && city && country) {
      const query = encodeURIComponent(`${name},${city},${country}`)
      const href = `https://www.google.com/maps/search/?api=1&query=${query}`
      rsdLinks.push({
        title:'Map',
        url: href,
        icon: <MapIcon />,
      })
    }

    return rsdLinks
  }

  return (
    <section className="grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4">
      <BaseSurfaceRounded className="flex justify-center p-8 overflow-hidden relative">
        <OrganisationLogo isMaintainer={isMaintainer} />
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="grid lg:grid-cols-[3fr_1fr] lg:gap-8 xl:grid-cols-[4fr_1fr] p-4">
        <div>
          <h1
            title={name}
            className="text-xl font-medium line-clamp-1">
            {name}
          </h1>
          <RorLocation
            city={city ?? null}
            country={country ?? null}
          />
          <p className="text-base-700 line-clamp-3 break-words py-4">
            {short_description}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <RorType ror_types={ror_types ?? null} />
          <Links links={getAllLinks()} />
        </div>
      </BaseSurfaceRounded>
    </section>
  )
}
