// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'

import {SoftwareListItem} from '~/types/SoftwareTypes'
import {getImageUrl} from '~/utils/editImage'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ImageWithPlaceholder from '~/components/layout/ImageWithPlaceholder'
import ProgrammingLanguageList from './ProgrammingLanguageList'
import SoftwareMetrics from './SoftwareMetrics'

type SoftwareCardProps = {
  item: SoftwareListItem
}

export default function SoftwareGridCard({item}:SoftwareCardProps){

  const visibleNumberOfKeywords: number = 3
  const visibleNumberOfProgLang: number = 3

  return (
    <Link
      data-testid="software-grid-card"
      href={`/software/${item.slug}`}
      className="flex-1 flex flex-col hover:text-inherit"
    >
      {/* Card content */}
      <div className="flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >
        {/* Cover image - 33% of card height */}
        <div className="h-[33%] flex overflow-hidden relative bg-base-100">
          <ImageWithPlaceholder
            src={`${getImageUrl(item.image_id) ?? ''}`}
            alt={`Logo for ${item.brand_name}`}
            type="gradient"
            className="w-full text-base-content-disabled p-4"
          />
        </div>
        {/* Card body - 67% of card height */}
        <div className="h-[67%] flex flex-col p-4">
          <CardTitleSubtitle
            title={item.brand_name}
            subtitle={item.short_statement}
          />

          {/* keywords */}
          <div className="flex-1 overflow-auto py-2">
            <KeywordList
              keywords={item.keywords}
              visibleNumberOfKeywords={visibleNumberOfKeywords}
            />
          </div>

          <div className="flex gap-2 justify-between mt-4">
            {/* Languages */}
            <ProgrammingLanguageList
              prog_lang={item.prog_lang}
              visibleNumberOfProgLang={visibleNumberOfProgLang}
            />
            {/* Metrics */}
            <SoftwareMetrics
              contributor_cnt={item.contributor_cnt ?? 0}
              mention_cnt={item.mention_cnt ?? 0}
              downloads={item.downloads}
            />
          </div>
        </div>
      </div>
    </Link>
  )
}
