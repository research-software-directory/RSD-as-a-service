// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ProgrammingLanguageList from '~/components/software/overview/cards/ProgrammingLanguageList'
import SoftwareMetrics from '~/components/software/overview/cards/SoftwareMetrics'
import useValidateImageSrc from '~/utils/useValidateImageSrc'

type HighlightsCardProps = {
  id:string
  slug:string
  brand_name: string
  short_statement: string
  // updated_at: string | null
  contributor_cnt: number | null
  mention_cnt: number | null
  // is_published: boolean
  image_id: string | null
  keywords: string[],
  prog_lang: string[],
  licenses: string,
  downloads?: number
}

export default function HighlightsCard(item: HighlightsCardProps) {
  const imgSrc = getImageUrl(item.image_id ?? null)
  const validImg = useValidateImageSrc(imgSrc)

  const visibleNumberOfKeywords: number = 3
  const visibleNumberOfProgLang: number = 3

  // console.group('HighlightsCard')
  // console.log('imgSrc...', imgSrc)
  // console.log('validImg...', validImg)
  // console.groupEnd()

  return (
    <Link
      data-testid="highlights-card"
      key={item.id}
      href={`/software/${item.slug}`}
      className="hover:text-inherit">
      <div className="shrink-0 transition bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer h-full select-none flex flex-col sm:flex-row sm:w-full" >
        {/*
          Cover image, show only if valid image link! To avoid the layout shift we
          flip the logic to hide the image only when the image link is not valid.
        */}
        { validImg === false || imgSrc === null ? null
          :
          <img
            className="object-contain object-left w-full rounded-tr-lg rounded-tl-lg sm:rounded-bl-lg sm:rounded-tl-lg sm:rounded-tr-none sm:h-[20rem]"
            src={imgSrc ?? undefined}
            alt={`Cover image for ${item.brand_name}`}
            style={{maxWidth:'22rem'}}
            // lighthouse audit requires explicit width and height
            height="100%"
            width="100%"
            loading='eager'
            // this is correct markup but supported yet
            // fetchPriority="high"
          />
        }

        {/* Card content */}
        <div className="flex flex-col p-4 max-w-[20rem] lg:max-w-[22rem] lg:h-[20rem]">
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
            <div className="flex gap-4">
              <SoftwareMetrics
                contributor_cnt={item.contributor_cnt}
                mention_cnt={item.mention_cnt}
                downloads={item.downloads}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
