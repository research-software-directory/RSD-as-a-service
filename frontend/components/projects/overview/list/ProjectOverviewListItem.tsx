// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'
import useValidateImageSrc from '~/utils/useValidateImageSrc'
import {ProjectListItem} from '~/types/Project'
import ProjectMetrics from '../cards/ProjectMetrics'


export default function ProjectOverviewListItem({item}: { item: ProjectListItem }) {
  const imgSrc = getImageUrl(item.image_id ?? null)
  const validImg = useValidateImageSrc(imgSrc)
  return (
    <Link
      data-testid="project-list-item"
      key={item.id}
      href={`/projects/${item.slug}`}
      className='hover:text-inherit'
      title={item.title}
    >
      <div className='flex gap-2 transition shadow-sm border bg-base-100 mb-2 rounded hover:shadow-lg'>
        {validImg ?
          <img
            src={`${imgSrc ?? ''}`}
            alt={`Cover image for ${item.title}`}
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
              {item.title}
            </div>
            <div className='line-clamp-3 md:line-clamp-1 break-words text-sm opacity-70'>
              {item.subtitle}
            </div>
          </div>

          {/* Metrics */}
          <div className="flex gap-5 mr-4">
            <ProjectMetrics
              impact_cnt={item.impact_cnt ?? 0}
              output_cnt={item.output_cnt ?? 0}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
