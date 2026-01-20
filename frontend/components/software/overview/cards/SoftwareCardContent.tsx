// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import CardContentFrame from '~/components/cards/CardContentFrame'
import CardImageFrame from '~/components/cards/CardImageFrame'
import RsdHostLabel from '~/components/cards/RsdHostLabel'
import ProgrammingLanguageList from './ProgrammingLanguageList'
import SoftwareMetrics from './SoftwareMetrics'
import {getImgUrl} from '../useSoftwareOverviewProps'

type SoftwareCardContentProps = {
  brand_name: string
  short_statement: string
  image_id: string | null
  keywords: string[] | null,
  prog_lang: string[] | null,
  contributor_cnt: number | null
  mention_cnt: number | null
  downloads?: number
  visibleKeywords?: number
  visibleProgLang?: number
  domain?: string|null
  rsd_host?: string|null
}

export default function SoftwareCardContent(item:SoftwareCardContentProps) {
  const imgUrl = getImgUrl({domain:item.domain,image_id:item.image_id})
  return (
    <div
      data-testid="software-card-content"
      className="flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >

      <CardImageFrame>
        <ImageWithPlaceholder
          src={imgUrl}
          alt={`Logo for ${item.brand_name}`}
          type="gradient"
          className="w-full text-base-content-disabled p-4"
          bgSize='scale-down'
        />
      </CardImageFrame>

      <CardContentFrame>
        <RsdHostLabel rsd_host={item?.rsd_host} domain={item?.domain}/>
        <CardTitleSubtitle
          title={item.brand_name}
          subtitle={item.short_statement}
        />
        {/* keywords */}
        <div className="flex-1 overflow-auto py-2">
          <KeywordList
            keywords={item.keywords}
            visibleNumberOfKeywords={item.visibleKeywords ?? 3}
          />
        </div>

        <div className="flex gap-2 justify-between mt-4">
          {/* Languages */}
          <ProgrammingLanguageList
            prog_lang={item.prog_lang ?? undefined}
            visibleNumberOfProgLang={item.visibleProgLang ?? 3}
          />
          {/* Metrics */}
          <div className="flex gap-4">
            <SoftwareMetrics
              contributor_cnt={item.contributor_cnt ?? 0}
              mention_cnt={item.mention_cnt ?? 0}
              downloads={item.downloads}
            />
          </div>
        </div>
      </CardContentFrame>
    </div>
  )
}
