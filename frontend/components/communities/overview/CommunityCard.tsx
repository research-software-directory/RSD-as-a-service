// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import CardImageFrame from '~/components/cards/CardImageFrame'
import CardContentFrame from '~/components/cards/CardContentFrame'
import OrganisationCardMetrics from '~/components/organisation/overview/card/OrganisationCardMetrics'
import {CommunityListProps} from '../apiCommunities'
// import CountryLabel from './CountryLabel'

export default function CommunityCard({community}:{community:CommunityListProps}) {

  return (
    <div className="relative">
      <Link
        data-testid="community-card-link"
        href={`/communities/${community.slug}/software?order=mentions`}
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
            <div className="flex-1">
              {/* <CountryLabel country={organisation.country} /> */}
              <CardTitleSubtitle
                title={community.name}
                subtitle={community.short_description ?? ''}
              />
            </div>
            <div className="flex gap-8 justify-evenly text-center">
              {/* Software packages count */}
              <div>
                <div className='text-5xl font-light'>
                  {community.software_cnt ?? 0}
                </div>
                <div className='text-center text-sm'>
                  software <br />package{community.software_cnt === 1 ? '' : 's'}
                </div>
              </div>
            </div>
          </CardContentFrame>
        </div>
      </Link>
    </div>
  )
}
