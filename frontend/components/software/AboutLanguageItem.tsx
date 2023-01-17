// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'
import {ssrSoftwareUrl} from '~/utils/postgrestUrl'

type AboutLanguageItemProps = {
  language: string,
  val: number,
  pct: number
}

export default function AboutLanguageItem(props: AboutLanguageItemProps) {
  const {language, pct} = props

  if (language.toLowerCase() === 'other') {
    // Other item has no search link
    return (
      <li>
        <div className="flex justify-between">
          <span>{language} {pct}%</span>
        </div>
        <div
          className="bg-primary"
          style={{
            width: `${pct}%`,
            height: '0.5rem',
            opacity: 0.5
          }}>
        </div>
      </li>
    )
  }

  // construct url
  const url = ssrSoftwareUrl({prog_lang: [language]})

  return (
    <li>
      <div className="flex justify-between">
        <span>{language} {pct}%</span>
        <Link
          title={`Click to filter for software using ${language}`}
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
          width: `${pct}%`,
          height: '0.5rem',
          opacity: 0.5
        }}>
      </div>
    </li>
  )
}
