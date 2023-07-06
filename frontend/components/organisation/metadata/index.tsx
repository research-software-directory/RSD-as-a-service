// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import LanguageIcon from '@mui/icons-material/Language'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'
import MapIcon from '@mui/icons-material/Map'

import {RORItem} from '~/utils/getROR'
import RorIcon from '~/components/icons/RorIcon'
import OrganisationLogo from './OrganisationLogo'
import RorType from './RorType'
import Links, {LinksProps} from './Links'
import RorLocation from './RorLocation'
import {getHostnameFromUrl} from '~/utils/getHostname'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import useOrganisationContext from '../context/useOrganisationContext'

type OrganisationMetadataProps = {
  ror_info: RORItem | null
}

export default function OrganisationMetadata({ror_info}: OrganisationMetadataProps) {
  const {name,short_description,country,website,isMaintainer} = useOrganisationContext()

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
    } else if (ror_info && ror_info.links && ror_info.links.length > 0) {
      const title = getHostnameFromUrl(ror_info.links[0]) ?? 'Website'
      rsdLinks.push({
        title,
        url: ror_info.links[0],
        icon: <LanguageIcon />,
      })
    }
    // ror_info.id is ror_id url
    if (ror_info && ror_info.id) {
      // add only new items
      rsdLinks.push({
        title:'ROR info',
        url: ror_info.id,
        icon: <RorIcon/>,
      })
    }
    // some organisations provide wikipedia page
    if (ror_info && ror_info?.wikipedia_url) {
      rsdLinks.push({
        title:'Wikipedia',
        url: ror_info?.wikipedia_url,
        icon: <AutoStoriesIcon />,
      })
    }
    // Google Maps link
    if (ror_info?.addresses[0].city && ror_info?.country.country_name) {
      const query = encodeURIComponent(`${name},${ror_info?.addresses[0].city},${ror_info?.country.country_name}`)
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
    <section className="grid  md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-4">
      <BaseSurfaceRounded className="flex justify-center p-8 overflow-hidden relative">
        <OrganisationLogo isMaintainer={isMaintainer} />
      </BaseSurfaceRounded>
      <BaseSurfaceRounded className="grid lg:grid-cols-[3fr,1fr] lg:gap-8 xl:grid-cols-[4fr,1fr] p-4">
        <div>
          <h1
            title={name}
            className="text-xl font-medium line-clamp-1">
            {name}
          </h1>
          <RorLocation
            city={ror_info?.addresses[0].city ?? null}
            country={ror_info?.country.country_name ?? country ?? null}
          />
          <p className="text-base-700 line-clamp-3 break-words py-4">
            {short_description}
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <RorType meta={ror_info} />
          <Links links={getAllLinks()} />
        </div>
      </BaseSurfaceRounded>
    </section>
  )
}
