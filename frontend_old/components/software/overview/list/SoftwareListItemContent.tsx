// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import ListImageWithGradientPlaceholder from '~/components/projects/overview/list/ListImageWithGradientPlaceholder'
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

  return (
    <>
      <ListImageWithGradientPlaceholder
        imgSrc={imgSrc}
        alt = {`Cover image for ${item.brand_name}`}
      />
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
