// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getPageUrl,visibleNumberOfKeywords,visibleNumberOfProgLang} from '../useSoftwareOverviewProps'
import SoftwareCardContent from './SoftwareCardContent'
import ExternalLinkIcon from './ExternalLinkIcon'

export type SoftwareCardProps = {
  id: string
  slug: string
  brand_name: string
  short_statement: string
  image_id: string | null
  keywords: string[] | null,
  prog_lang: string[] | null,
  contributor_cnt: number | null
  mention_cnt: number | null
  downloads?: number
  source?: string | null
  domain?: string | null
}

export default function SoftwareGridCard(item:SoftwareCardProps){
  const pageUrl = getPageUrl({domain:item.domain,slug:item.slug})
  return (
    <Link
      data-testid="software-grid-card"
      href={pageUrl}
      className="flex-1 flex flex-col hover:text-inherit relative group"
      target={item.domain ? '_blank' : '_self'}
    >
      {/* Requires tailwind classes relative and group */}
      <ExternalLinkIcon domain={item.domain} />

      <SoftwareCardContent
        visibleKeywords={visibleNumberOfKeywords}
        visibleProgLang={visibleNumberOfProgLang}
        {...item}
      />

    </Link>
  )
}
