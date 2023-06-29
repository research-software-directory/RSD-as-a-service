// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import {getImageUrl} from '~/utils/editImage'
import useValidateImageSrc from '~/utils/useValidateImageSrc'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ProgrammingLanguageList from './ProgrammingLanguageList'
import SoftwareMetrics from './SoftwareMetrics'

type SoftwareCardProps = {
  item: SoftwareOverviewItemProps
}

export default function SoftwareMasonryCard({item}:SoftwareCardProps){
  const imgSrc = getImageUrl(item.image_id ?? null)
  const validImg = useValidateImageSrc(imgSrc)

  const visibleNumberOfKeywords: number = 3
  const visibleNumberOfProgLang: number = 3

  return (
    <Link
      data-testid="software-masonry-card"
      key={item.id}
      href={`/software/${item.slug}`}
      className="hover:text-inherit">
      <div className="flex-shrink-0 transition bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer h-full select-none flex-col">
        {/* Cover image, show only if valid image link */}
        {
          validImg &&
          <img
            className="object-cover w-full rounded-tr-lg rounded-tl-lg"
            src={`${imgSrc ?? ''}`}
            alt={`Cover image for ${item.brand_name}`}
          />
        }
        {/* Card content */}
        <div className="flex flex-col p-4">
          <CardTitleSubtitle
            title={item.brand_name}
            subtitle={item.short_statement}
          />
          {item.keywords &&
            <div className="py-2">
              <KeywordList
                keywords={item.keywords}
                visibleNumberOfKeywords={visibleNumberOfKeywords}
              />
            </div>
           }
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
