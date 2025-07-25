// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import CardImageFrame from '~/components/cards/CardImageFrame'
import CardContentFrame from '~/components/cards/CardContentFrame'
import {CommunityListProps} from '../apiCommunities'
import KeywordList from '~/components/cards/KeywordList'
import CommunityMetrics from './CommunityMetrics'

export default function CommunityCard({community}:{community:CommunityListProps}) {

  return (
    <div className="relative">
      <Link
        data-testid="community-card-link"
        href={`/communities/${community.slug}/software`}
        className="flex h-full hover:text-inherit"
        passHref
      >
        <div className = "flex flex-col transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer select-none w-full relative" >
          <CardImageFrame>
            <ImageWithPlaceholder
              src={`${getImageUrl(community.logo_id) ?? ''}`}
              alt={`Logo for ${community.name}`}
              type="gradient"
              className={`w-full text-base-content-disabled ${community.logo_id ? 'p-4':''}`}
              bgSize={'scale-down'}
            />
          </CardImageFrame>
          <CardContentFrame>

            {/* title & subtitle  */}
            <CardTitleSubtitle
              title={community.name}
              subtitle={community.short_description ?? ''}
            />

            {/* keywords */}
            <div className="flex-1 overflow-auto py-2">
              <KeywordList
                keywords={community.keywords}
              />
            </div>

            {/* Metrics */}
            <div className="flex gap-4 justify-end text-center">
              <CommunityMetrics
                software_cnt={community.software_cnt ?? 0}
                pending_cnt={community.pending_cnt}
              />
            </div>
          </CardContentFrame>
        </div>
      </Link>
    </div>
  )
}
