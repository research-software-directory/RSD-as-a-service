// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {SoftwareListItem} from '~/types/SoftwareTypes'
import {getImageUrl} from '~/utils/editImage'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ProgrammingLanguageList from '~/components/software/overview/cards/ProgrammingLanguageList'
import SoftwareMetrics from '~/components/software/overview/cards/SoftwareMetrics'
import useValidateImageSrc from '~/utils/useValidateImageSrc'

type SoftwareCardProps = {
  item: SoftwareListItem
}

export default function HighlightsCard({item}: SoftwareCardProps) {
  const imgSrc = getImageUrl(item.image_id ?? null)
  const validImg = useValidateImageSrc(imgSrc)

  const visibleNumberOfKeywords: number = 3
  const visibleNumberOfProgLang: number = 3

  return (
    <Link
      data-testid="highlights-card"
      key={item.id}
      href={`/software/${item.slug}`}
      className="hover:text-inherit">
      <div className="flex-shrink-0 transition bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer h-full select-none flex flex-col sm:flex-row sm:w-full" >
        {/* Cover image, show only if valid image link */}
        {
          validImg &&
          <img
            className="object-contain object-left w-full rounded-tr-lg rounded-tl-lg sm:rounded-bl-lg sm:rounded-tl-lg sm:rounded-tr-none sm:h-[20rem]"
            src={`${imgSrc ?? ''}`}
            alt={`Cover image for ${item.brand_name}`}
            style={{maxWidth:'20rem'}}
          />
        }
        {/* Card content */}
        <div className="flex flex-col p-4 max-w-[20rem] lg:max-w-[22rem]">
          <CardTitleSubtitle
            title={item.brand_name}
            subtitle={item.short_statement}
          />

          {/* keywords */}
          <div className="flex-1 overflow-hidden pt-2">
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
              contributor_cnt={item.contributor_cnt}
              mention_cnt={item.mention_cnt}
              downloads={item.downloads}
            />
          </div>
        </div>
      </div>
  </Link>
  )
}
