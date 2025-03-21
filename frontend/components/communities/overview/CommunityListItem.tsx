// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import {getImageUrl} from '~/utils/editImage'
import {CommunityListProps} from '../apiCommunities'
import CommunityMetrics from './CommunityMetrics'

export default function CommunityListItem({community}:{community:CommunityListProps}) {
  const imgSrc = getImageUrl(community.logo_id ?? null)

  return (
    <OverviewListItem className="flex-none">
      <Link
        data-testid="community-list-item"
        key={community.id}
        href={`/communities/${community.slug}`}
        className='flex-1 flex items-center hover:text-inherit bg-base-100 rounded-xs'
      >
        <ListImageWithGradientPlaceholder
          imgSrc={imgSrc}
          alt = {`Cover image for ${community.name}`}
        />
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
              {community.name}
            </div>
            <div className='line-clamp-4 md:line-clamp-2 break-words text-sm opacity-70'>
              {community.short_description}
            </div>
          </div>
          {/* software count */}
          <div className="flex items-center gap-4 mr-4">
            <CommunityMetrics
              software_cnt={community.software_cnt ?? 0}
              pending_cnt={community.pending_cnt}
            />
          </div>
        </div>
      </Link>
    </OverviewListItem>
  )
}
