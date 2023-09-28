// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import KeywordList from '~/components/cards/KeywordList'
import CardTitleSubtitle from '~/components/cards/CardTitleSubtitle'
import ProgrammingLanguageList from './ProgrammingLanguageList'
import SoftwareMetrics from './SoftwareMetrics'

type SoftwareCardContentProps = {
  // slug:string
  brand_name: string
  short_statement: string
  image_id: string | null
  keywords: string[],
  prog_lang: string[],
  contributor_cnt: number | null
  mention_cnt: number | null
  downloads?: number
  visibleKeywords?: number
  visibleProgLang?: number
}

export default function SoftwareCardNoImage(item:SoftwareCardContentProps) {

  return (
    <div
      data-testid="software-card-content"
      className="flex-1 p-4 flex flex-col h-full transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-md" >
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
          prog_lang={item.prog_lang}
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
    </div>
  )
}
