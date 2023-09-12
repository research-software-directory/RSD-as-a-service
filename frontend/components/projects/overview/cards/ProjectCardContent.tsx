// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectStatusKey} from '~/types/Project'
import {getImageUrl} from '~/utils/editImage'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import CardImageFrame from '~/components/cards/CardImageFrame'
import CardContentFrame from '~/components/cards/CardContentFrame'
import ProjectMetrics from './ProjectMetrics'
import ResearchDomainTitle from './ResearchDomainTitle'
import ProjectPeriod from './ProjectPeriod'

type ProjectCardProps = {
  // id: string
  slug: string
  title: string
  subtitle: string
  date_start: string | null
  date_end: string | null
  // updated_at: string | null
  // is_published: boolean
  image_id: string | null
  image_contain: boolean
  keywords: string[] | null
  research_domain: string[] | null
  // participating_organisations: string[]
  impact_cnt: number | null
  output_cnt: number | null
  visibleKeywords?: number
  project_status: ProjectStatusKey
}

export default function ProjectCardContent(item:ProjectCardProps){

  return (
    <div
      data-testid="project-card-content"
      className="flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >
      {/* Cover image */}
      <CardImageFrame>
        <ImageWithPlaceholder
          src={`${getImageUrl(item.image_id) ?? ''}`}
          alt={`Logo for ${item.title}`}
          type="gradient"
          className={`w-full text-base-content-disabled ${item.image_contain ? 'p-4':''}`}
          bgSize={item.image_contain ? 'scale-down' : 'cover'}
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
            visibleNumberOfKeywords={item.visibleKeywords ?? 3}
          />
        </div>
        <div className="flex gap-2 justify-between mt-2">
          <div>
            <ProjectPeriod
              date_start={item.date_start}
              date_end={item.date_end}
            />
          </div>
          {/* Metrics */}
          <div className="flex gap-4">
            <ProjectMetrics
              impact_cnt={item.impact_cnt ?? 0}
              output_cnt={item.output_cnt ?? 0}
            />
          </div>
        </div>
      </CardContentFrame>
    </div>
  )
}
