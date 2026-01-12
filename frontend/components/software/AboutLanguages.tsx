// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import Code from '@mui/icons-material/Code'

import {sortOnNumProp} from '~/utils/sortFn'
import logger from '~/utils/logger'
import {CodePlatform, ProgrammingLanguages} from './edit/repositories/apiRepositories'
import AboutLanguageItem from './AboutLanguageItem'

/**
 * Calculate programming languages percentages.
 * Include only languages > 1% of code base.
 * Put all others in Other category.
 * @param languages
 * @returns
 */
function calculateStats(languages: ProgrammingLanguages) {
  try {
    // extract language keys
    const keys = Object.keys(languages)
    let total = 0, totPct=0, totVal=0
    const totLang=[]
    // calculate total
    keys.forEach((key) => {
      total+=languages[key]
    })
    // calculate stats
    const stats: {language: string, val: number, pct: number}[] = []
    keys.forEach(key => {
      const pct = Math.round((languages[key] / total) * 100)
      if (pct > 0) {
        totPct += pct
        totVal += languages[key]
        totLang.push(key)
        stats.push({language: key, val: languages[key], pct: pct})
      }
    })

    // order stats by percentage before adding 'Other'
    stats.sort((a, b) => {
      return a.pct !== b.pct ? b.pct - a.pct : a.language.localeCompare(b.language)
    })

    // do we need Other category?
    if (totPct < 100 && (keys.length - totLang.length > 1)) {
      // add other to stats
      stats.push({language: 'Other', val: total - totVal, pct: 100 - totPct})
    }
    return stats
  } catch (e:any) {
    logger(`AboutLanguages: Failed to calculateStats. Error: ${e.message}`, 'error')
    return []
  }
}

export default function AboutLanguages({languages, platform}:
{languages?: ProgrammingLanguages, platform?: CodePlatform}) {
  let label = 'Programming language'

  // don't render section if no languages
  if (typeof languages == 'undefined' || languages === null) return null

  let stats = []
  if (platform === 'gitlab') {
    // GitLab api stats already in %
    // we only map and sort by %
    stats = Object.keys(languages)
      .map(key => ({
        language: key,
        val: languages[key],
        pct: Math.round(languages[key])
      }))
      .sort((a,b)=>sortOnNumProp(a,b,'pct','desc'))
  } else {
    stats = calculateStats(languages)
  }

  // don't render if stats failed
  if (typeof stats == 'undefined' || stats.length == 0) {
    return null
  } else if (stats.length > 1) {
    label += 's'
  }

  return (
    <div>
      <div className="pb-2">
        <Code color="primary" />
        <span className="text-primary pl-2">{label}</span>
      </div>
      <ul className="py-1">
        {/* show only stat selection pct > 0 and exclude other category */}
        {stats?.map((props) => {
          return <AboutLanguageItem key={props.language} {...props} />
        })}
      </ul>
    </div>
  )
}
