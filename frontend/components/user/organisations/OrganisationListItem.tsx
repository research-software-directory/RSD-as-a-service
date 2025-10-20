// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import ListTitleSubtitle from '~/components/layout/ListTitleSubtitle'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import OrganisationMetrics from './OrganisationMetrics'

type OrganisationListItemProps=Readonly<{
  id: string
  name: string
  short_description: string | null
  logo_id: string | null,
  rsd_path: string
  software_cnt: number | null,
  project_cnt: number | null,
}>

export default function OrganisationListItem({organisation}:Readonly<{organisation:OrganisationListItemProps}>) {
  const imgSrc = getImageUrl(organisation.logo_id ?? null)

  return (
    <OverviewListItem className="flex-none">
      <OverviewListItemLink
        href={`/organisations/${organisation.rsd_path}`}
      >
        <ListImageWithGradientPlaceholder
          imgSrc={imgSrc}
          alt = {`Cover image for ${organisation.name}`}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <ListTitleSubtitle
              title={organisation.name}
              subtitle={organisation.short_description}
            />
          </div>
          {/* metrics */}
          <div className="flex items-center gap-4 mr-4">
            <OrganisationMetrics
              software_cnt={organisation.software_cnt ?? 0}
              project_cnt={organisation.project_cnt ?? 0}
            />
          </div>
        </div>
      </OverviewListItemLink>
    </OverviewListItem>
  )
}
