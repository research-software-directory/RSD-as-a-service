// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {SoftwareOverviewItemProps} from '~/types/SoftwareTypes'
import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import RsdHostLabel from '~/components/cards/RsdHostLabel'
import ProgrammingLanguageList from './ProgrammingLanguageList'
import SoftwareMetrics from './SoftwareMetrics'
import useSoftwareOverviewProps from '../useSoftwareOverviewProps'
import ExternalLinkIcon from './ExternalLinkIcon'

type SoftwareCardProps = {
  item: SoftwareOverviewItemProps
}

export default function SoftwareMasonryCard({item}:SoftwareCardProps){
  const {
    imgUrl,pageUrl,
    validImg,visibleNumberOfKeywords,
    visibleNumberOfProgLang
  } = useSoftwareOverviewProps({
    id: item.id,
    domain:item.domain,
    image_id: item.image_id,
    slug: item.slug
  })

  return (
    <Link
      data-testid="software-masonry-card"
      href={pageUrl}
      className="hover:text-inherit">
      <div className="shrink-0 transition bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer h-full select-none flex-col relative group">
        {/* Cover image, show only if valid image link */}
        { validImg === false ? null
          :
          <img
            className="object-cover w-full rounded-tr-lg rounded-tl-lg"
            src={imgUrl ?? undefined}
            alt={`Cover image for ${item.brand_name}`}
            // loading = "lazy"
            // lighthouse audit requires explicit with and height
            height="100%"
            width="100%"
          />
        }
        {/* Requires tailwind classes relative and group */}
        <ExternalLinkIcon domain={item.domain} />
        {/* Card content */}
        <div className="flex flex-col p-4">
          <RsdHostLabel rsd_host={item?.rsd_host} domain={item?.domain}/>
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
            <div className="flex gap-4">
              <SoftwareMetrics
                contributor_cnt={item.contributor_cnt ?? 0}
                mention_cnt={item.mention_cnt ?? 0}
                downloads={item.downloads}
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
