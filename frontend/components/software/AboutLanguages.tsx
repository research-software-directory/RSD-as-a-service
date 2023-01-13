// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Code from '@mui/icons-material/Code'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import {ssrSoftwareUrl} from '~/utils/postgrestUrl'
import {ProgramingLanguages} from '../../types/SoftwareTypes'
import logger from '../../utils/logger'

/**
 * Calculate programming languages percentages.
 * Inlclude only languages > 1% of code base.
 * Put all others in Other category.
 * @param languages
 * @returns
 */
function calculateStats(languages: ProgramingLanguages) {
  try {
    // extract language keys
    const keys = Object.keys(languages)

    let total = 0, totPct=0, totVal=0, totLang=[]
    // calculate total
    keys.map((key) => {
      total+=languages[key]
    })
    // calculate stats
    const stats: {language: string, val: number, pct: number}[] = []
    keys.map(key => {
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
  }
}


export default function AboutLanguages({languages}: {languages: ProgramingLanguages }) {
  // don't render section if no languages
  if (typeof languages == 'undefined' || languages === null) return null
  const stats = calculateStats(languages)
  // don't render if stats failed
  if (typeof stats == 'undefined') return null

  return (
    <>
    <div className="pt-8 pb-2">
      <Code color="primary" />
      <span className="text-primary pl-2">Programming language</span>
    </div>
    <ul className="py-1">
      {/* show only stat selection pct > 0*/}
      {stats?.map((entry) => {
        const url = ssrSoftwareUrl({prog_lang: [entry.language]})
        return (
          <li key={entry.language}>
            <div className="flex justify-between">
              <span>{entry.language} {entry.pct}%</span>
              <Link
                title={`Click to filter for software using ${entry.language}`}
                href={url}
                passHref
              >
                <SearchIcon sx={{
                  marginRight: '0.5rem',
                  color:'text.secondary'
                }} />
              </Link>
            </div>
            <div
              className="bg-primary"
              style={{
                width: `${entry.pct}%`,
                height: '0.5rem',
                opacity: 0.5
              }}>
            </div>
          </li>
        )
      })}
    </ul>
    </>
  )
}
