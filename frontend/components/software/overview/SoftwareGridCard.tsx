// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'

import {SoftwareListItem} from '~/types/SoftwareTypes'
import {getImageUrl} from '~/utils/editImage'
import KeywordList from './KeywordList'
import ProgrammingLanguageList from './ProgrammingLanguageList'
import SoftwareMetrics from './SoftwareMetrics'

type SoftwareCardProps = {
  item: SoftwareListItem;
  direction?: string
}

export default function SoftwareGridCard({item, direction}:SoftwareCardProps){

  const visibleNumberOfKeywords: number = 3
  const visibleNumberOfProgLang: number = 3

  return (
    <Link
      href={`/software/${item.slug}`}
      className="flex-1 flex flex-col hover:text-inherit"
    >
      {/* Card content */}
      <div className="flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >
        {/* Cover image - 40% of card height */}
        {
          item.image_id &&
          <div className="h-[40%] overflow-hidden relative">
            <img
              // style={{...imgStyle}}
              className="w-full object-cover absolute left-0 top-0 right-0 bottom-0"
              src={`${getImageUrl(item.image_id) ?? ''}`}
              alt={`Cover image for ${item.brand_name}`}
            />
          </div>
        }
        {/* Card body - 60% of card height */}
        <div className={`${item.image_id ? 'h-[60%]' : 'flex-1'} flex flex-col p-4`}>
          <h2 className="text-xl font-medium line-clamp-1">
            {item.brand_name}
          </h2>
          <div className="py-2"></div>
            <p className="text-gray-600 line-clamp-3 break-words">
              {item.short_statement}
            </p>
          <div>
        </div>
        {/* keywords */}
        <div className="flex-1 overflow-hidden">
          <KeywordList
            keywords={item.keywords}
            visibleNumberOfKeywords={visibleNumberOfKeywords}
          />
        </div>

          {/* <div className="flex-1" /> */}
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
