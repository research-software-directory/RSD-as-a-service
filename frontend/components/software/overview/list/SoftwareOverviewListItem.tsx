// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {getImageUrl} from '~/utils/editImage'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import useValidateImageSrc from '~/utils/useValidateImageSrc'
import ContributorIcon from '~/components/icons/ContributorIcon'
import MentionIcon from '~/components/icons/MentionIcon'
import DownloadsIcon from '~/components/icons/DownloadsIcon'

export default function SoftwareOverviewListItem({item}:{item:SoftwareListItem}) {
  const imgSrc = getImageUrl(item.image_id ?? null)
  const validImg = useValidateImageSrc(imgSrc)
  return (
    <Link
      data-testid="software-list-item"
      key={item.id}
      href={`/software/${item.slug}`}
      className='hover:text-inherit'
      title={item.brand_name}
    >
      <div className='flex gap-2 transition shadow-sm border bg-base-100 mb-2 rounded hover:shadow-lg'>
        {validImg ?
          <img
            src={`${imgSrc ?? ''}`}
            alt={`Cover image for ${item.brand_name}`}
            className="w-12 max-h-[3.5rem] text-base-content-disabled p-2 object-contain object-center"
          />
          :
          <div
            className="w-12 bg-gradient-to-br from-base-300 from-0% via-base-100 via-70% to-base-100"
          />
        }
        <div className="flex flex-col md:flex-row gap-3 flex-1 py-2">
          <div className="flex-1">
            <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
              {item.brand_name}
            </div>
            <div className='line-clamp-3 md:line-clamp-1 break-words text-sm opacity-70'>
              {item.short_statement}
            </div>
          </div>

          {/* Indicators */}
          <div className="flex gap-5 mr-4">
            <div className="flex gap-2 items-center">
              <ContributorIcon />
              <span className="text-sm">{item.contributor_cnt || 0}</span>
            </div>
            <div className="flex gap-2 items-center">
              <MentionIcon />
              <span className="text-sm">{item.mention_cnt || 0}</span>
            </div>

          {/* TODO Add download counts to the cards */}
          {(item?.downloads && item?.downloads > 0) &&
            <div className="flex gap-2 items-center">
              <DownloadsIcon />
              <span className="text-sm">34K</span>
            </div>
          }
          </div>
        </div>
      </div>
    </Link>
  )
}
