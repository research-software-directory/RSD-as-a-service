// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import {getImageUrl} from '~/utils/editImage'
import useValidateImageSrc from '~/utils/useValidateImageSrc'
import SoftwareMetrics from '../cards/SoftwareMetrics'

type SoftwareOverviewListItemProps = {
  // id:string
  // slug:string
  brand_name: string
  short_statement: string
  image_id: string | null
  // updated_at: string | null
  contributor_cnt: number | null
  mention_cnt: number | null
  is_published: boolean
  // keywords: string[],
  // prog_lang: string[],
  // licenses: string,
  downloads?: number
  statusBanner?: JSX.Element
}

export default function SoftwareListItemContent(item:SoftwareOverviewListItemProps) {
  const imgSrc = getImageUrl(item.image_id ?? null)
  const validImg = useValidateImageSrc(imgSrc)
  return (
    <>
      {validImg ?
        <img
          src={`${imgSrc ?? ''}`}
          alt={`Cover image for ${item.brand_name}`}
          className="w-12 max-h-[3.5rem] text-base-content-disabled p-2 object-contain object-center"
        />
        :
        <div
          className="w-12 self-stretch bg-gradient-to-br from-base-300 from-0% via-base-100 via-50% to-base-100"
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
          {/* project status - admin only */}
          {item.statusBanner &&
            <div className="pt-2 flex gap-2 text-xs opacity-60">
              {item.statusBanner}
            </div>
          }
        </div>
        <div className="flex items-center gap-4">
          {/* Metrics */}
          <SoftwareMetrics
            contributor_cnt={item.contributor_cnt ?? 0}
            mention_cnt={item.mention_cnt ?? 0}
            downloads={item.downloads}
          />
        </div>
      </div>
    </>
  )
}
