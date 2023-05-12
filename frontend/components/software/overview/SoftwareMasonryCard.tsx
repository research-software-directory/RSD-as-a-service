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
import ProgrammingLanguageList from '~/components/cards/ProgrammingLanguageList'
import SoftwareMetrics from '~/components/cards/SoftwareMetrics'

type SoftwareCardProps = {
  item: SoftwareListItem
}

export default function SoftwareMasonryCard({item}:SoftwareCardProps){

  const visibleNumberOfKeywords: number = 3
  const visibleNumberOfProgLang: number = 3

  return (
    <Link
      data-testid="software-masonry-card"
      key={item.id}
      href={`/software/${item.slug}`}
      className="hover:text-inherit">
      <div className="flex-shrink-0 transition bg-white shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer h-full select-none flex-col">
        {/* Cover image */}
        {
          item.image_id &&
          <img
            className="object-cover w-full rounded-tr-lg rounded-tl-lg"
            src={`${getImageUrl(item.image_id) ?? ''}`}
            alt={`Cover image for ${item.brand_name}`}
          />
        }

        {/* Card content */}
        <div className="flex flex-col p-4">
          <CardTitleSubtitle
            title={item.brand_name}
            subtitle={item.short_statement}
          />

          <KeywordList
            keywords={item.keywords}
            visibleNumberOfKeywords={visibleNumberOfKeywords}
          />

          <div className="flex gap-2 justify-between mt-8">
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
