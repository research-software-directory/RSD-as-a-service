// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import OrganisationCardMetrics from './OrganisationCardMetrics'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import CardImageFrame from '~/components/cards/CardImageFrame'
import CardContentFrame from '~/components/cards/CardContentFrame'
import CountryLabel from './CountryLabel'
import TenantBadge from './TenantBadge'

export type OrganisationCardProps = {
  id: string,
  name: string,
  short_description: string | null,
  country: string | null,
  is_tenant: boolean,
  rsd_path: string,
  logo_id: string | null
  software_cnt: number | null
  project_cnt: number | null
}

export default function OrganisationCard({organisation}: { organisation: OrganisationCardProps }) {

  return (
    <div className="relative">
      <Link
        data-testid="organisation-card-link"
        href={`/organisations/${organisation.rsd_path}`}
        className="flex h-full hover:text-inherit"
        passHref
      >
        <div className = "flex flex-col transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer select-none w-full relative" >
          <CardImageFrame>
            <ImageWithPlaceholder
              src={`${getImageUrl(organisation.logo_id) ?? ''}`}
              alt={`Logo for ${organisation.name}`}
              type="gradient"
              className={`w-full text-base-content-disabled ${organisation.logo_id ? 'p-4':''}`}
              bgSize={'scale-down'}
            />
          </CardImageFrame>
          <CardContentFrame>
            <div className="flex-1">
              <CountryLabel country={organisation.country} />
              <CardTitleSubtitle
                title={organisation.name}
                subtitle={organisation.short_description ?? ''}
              />
            </div>
            <div className="flex gap-8 justify-evenly text-center">
              <OrganisationCardMetrics
                software_cnt={organisation.software_cnt}
                project_cnt={organisation.project_cnt}
              />
            </div>
          </CardContentFrame>
          {organisation.is_tenant ?
            <div className="flex items-end text-base-600 absolute top-2 right-1">
              <TenantBadge/>
            </div>
            :null
          }
        </div>
      </Link>
    </div>
  )
}
