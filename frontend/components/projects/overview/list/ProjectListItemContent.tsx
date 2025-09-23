// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import {getImageUrl} from '~/utils/editImage'
import ListTitleSubtitle from '~/components/layout/ListTitleSubtitle'
import ProjectMetrics from '~/components/projects/overview/cards/ProjectMetrics'
import ListImageWithGradientPlaceholder from './ListImageWithGradientPlaceholder'

type ProjectListItemProps = {
  title: string
  subtitle: string
  image_id: string | null
  impact_cnt: number | null
  output_cnt: number | null
  statusBanner?: JSX.Element
}

export default function ProjectListItemContent(item: ProjectListItemProps) {
  const imgSrc = getImageUrl(item.image_id ?? null)
  return (
    <>
      <ListImageWithGradientPlaceholder
        imgSrc={imgSrc}
        alt = {`Cover image for ${item.title}`}
      />
      <div className="flex flex-col md:flex-row gap-3 flex-1 py-2">
        <div className="flex-1">
          <ListTitleSubtitle
            title={item.title}
            subtitle={item.subtitle}
          />
          {/* project status - admin only */}
          {item.statusBanner &&
            <div className="pt-2 flex gap-2 text-xs opacity-60">
              {item.statusBanner}
            </div>
          }
        </div>
        {/* Metrics */}
        <div className="flex gap-4 mr-4">
          <ProjectMetrics
            impact_cnt={item.impact_cnt ?? 0}
            output_cnt={item.output_cnt ?? 0}
          />
        </div>
      </div>
    </>
  )
}
