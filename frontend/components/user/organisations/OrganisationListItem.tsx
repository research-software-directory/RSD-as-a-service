// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {getImageUrl} from '~/utils/editImage'
import {OrganisationForOverview} from '~/types/Organisation'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OrganisationMetrics from './OrganisationMetrics'

export default function OrganisationListItem({organisation}:{readonly organisation:OrganisationForOverview}) {
  const imgSrc = getImageUrl(organisation.logo_id ?? null)

  return (
    <OverviewListItem className="flex-none">
      <Link
        data-testid="organisation-list-item"
        key={organisation.id}
        href={`/organisations/${organisation.rsd_path}`}
        className='flex-1 flex items-center hover:text-inherit bg-base-100 rounded-xs'
      >
        <ListImageWithGradientPlaceholder
          imgSrc={imgSrc}
          alt = {`Cover image for ${organisation.name}`}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
              {organisation.name}
            </div>
            <div className='line-clamp-4 md:line-clamp-2 break-words text-sm opacity-70'>
              {organisation.short_description}
            </div>
          </div>
          {/* metrics */}
          <div className="flex items-center gap-4 mr-4">
            <OrganisationMetrics
              software_cnt={organisation.software_cnt ?? 0}
              project_cnt={organisation.project_cnt ?? 0}
            />
          </div>
        </div>
      </Link>
    </OverviewListItem>
  )
}
