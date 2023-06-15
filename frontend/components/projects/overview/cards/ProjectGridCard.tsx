// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {ProjectListItem} from '~/types/Project'
import {getImageUrl} from '~/utils/editImage'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import ProjectMetrics from './ProjectMetrics'
import ProjectDuration from './ProjectDuration'
import PeriodProgressBar from '~/components/charts/progress/PeriodProgressBar'
import ResearchDomainTitle from './ResearchDomainTitle'
import CardImageFrame from '~/components/cards/CardImageFrame'
import CardContentFrame from '~/components/cards/CardContentFrame'

type ProjectCardProps = {
  item: ProjectListItem
}

export default function ProjectGridCard({item}:ProjectCardProps){
  const visibleNumberOfKeywords: number = 3

  return (
    <Link
      data-testid="project-grid-card"
      href={`/projects/${item.slug}`}
      className="flex-1 flex flex-col hover:text-inherit"
    >
      {/* Card content */}
      <div className="flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >
        {/* Cover image */}
        <CardImageFrame>
          <ImageWithPlaceholder
            src={`${getImageUrl(item.image_id) ?? ''}`}
            alt={`Logo for ${item.title}`}
            type="gradient"
            className={`w-full text-base-content-disabled ${item.image_contain ? 'p-4':''}`}
            bgSize={item.image_contain ? 'contain' : 'cover'}
          />
        </CardImageFrame>
        {/* Card body */}
        <CardContentFrame>
          <ResearchDomainTitle
            domains={item.research_domain ?? []}
          />
          <CardTitleSubtitle
            title={item.title}
            subtitle={item.subtitle}
          />
          {/* keywords */}
          <div className="flex-1 overflow-auto py-2">
            <KeywordList
              keywords={item.keywords}
              visibleNumberOfKeywords={visibleNumberOfKeywords}
            />
          </div>

          <div className="flex gap-2 justify-between mt-2">
            <div>
              {
                // show only if both dates present
                item.date_start &&
                item.date_end &&
                <>
                  <ProjectDuration
                    date_start={item.date_start}
                    date_end={item.date_end}
                  />
                  <PeriodProgressBar
                    date_start={item.date_start}
                    date_end={item.date_end}
                    className="mt-[0.0625rem] rounded"
                    height="0.375rem"
                  />
                </>
              }
            </div>
            {/* Metrics */}
            <ProjectMetrics
              impact_cnt={item.impact_cnt ?? 0}
              output_cnt={item.output_cnt ?? 0}
            />
          </div>
        </CardContentFrame>
      </div>
    </Link>
  )
}
