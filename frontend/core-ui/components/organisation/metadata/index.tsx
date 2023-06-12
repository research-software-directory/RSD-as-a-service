// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {RORItem} from '~/utils/getROR'
import OrganisationLogo from './OrganisationLogo'
import {OrganisationForOverview} from '~/types/Organisation'
import RorType from './RorType'
import Links, {LinksProps} from './Links'
import RorLocation from './RorLocation'
import LanguageIcon from '@mui/icons-material/Language'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AutoStoriesIcon from '@mui/icons-material/AutoStories'

type OrgnisationInfoProps = {
  organisation: OrganisationForOverview,
  meta: RORItem|null,
  isMaintainer: boolean
}

export default function OrganisationMetadata({organisation, meta, isMaintainer}: OrgnisationInfoProps) {

  function getAllLinks() {
    const rsdLinks:LinksProps[]=[]
    if (organisation.website) {
      // website as first link
      rsdLinks.push({
        title: 'Website',
        url: organisation.website,
        icon: <LanguageIcon />,
      })
    } else if (meta && meta.links && meta.links.length > 0) {
      rsdLinks.push({
        title: 'Website',
        url: meta.links[0],
        icon: <LanguageIcon />,
      })
    }
    // meta.id is ror_id url
    if (meta && meta.id) {
      // add only new items
      rsdLinks.push({
        title:'ROR info',
        url: meta.id,
        icon: <InfoOutlinedIcon />,
      })
    }
    // some organisations provide wikipedia page
    if (meta && meta?.wikipedia_url) {
      rsdLinks.push({
        title:'Wikipedia',
        url: meta?.wikipedia_url,
        icon: <AutoStoriesIcon />,
      })
    }
    return rsdLinks
  }

  return (
    <div className="my-8 p-6 border min-h-[9rem] max-w-[20rem]"
      style={{
        borderRadius:'0rem 2rem'
      }}
    >
      <OrganisationLogo
        id={organisation.id}
        logo_id={organisation.logo_id}
        name={organisation.name}
        isMaintainer={isMaintainer}
      />
      <RorType meta={meta} />
      <RorLocation meta={meta} />
      <Links links={getAllLinks()} />
    </div>
  )
}
