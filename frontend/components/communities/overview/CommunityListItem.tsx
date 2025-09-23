// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import ListTitleSubtitle from '~/components/layout/ListTitleSubtitle'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import CommunityMetrics from './CommunityMetrics'

export default function CommunityListItem({community}:{community:CommunityListProps}) {
  const imgSrc = getImageUrl(community.logo_id ?? null)

  return (
    <OverviewListItem className="flex-none">
      <OverviewListItemLink
        href={`/communities/${community.slug}/software`}
      >
        <ListImageWithGradientPlaceholder
          imgSrc={imgSrc}
          alt = {`Cover image for ${community.name}`}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <ListTitleSubtitle
              title={community.name}
              subtitle={community.short_description}
            />
          </div>
          {/* software count */}
          <div className="flex items-center gap-4 mr-4">
            <CommunityMetrics
              software_cnt={community.software_cnt ?? 0}
              pending_cnt={community.pending_cnt}
            />
          </div>
        </div>
      </OverviewListItemLink>
    </OverviewListItem>
  )
}
