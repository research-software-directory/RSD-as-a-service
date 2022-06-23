// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import MuiBreadcrumbs from '@mui/material/Breadcrumbs'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Link from 'next/link'

export type SlugInfo = {
  label: string,
  path: string | null
}


export default function Breadcrumbs({segments}:
  {segments: SlugInfo[] }) {

  if (segments.length === 0) return null

  function renderSegments() {
    const html: any[] = []

    segments.forEach(item => {
      if (item.path) {
        html.push(
          <Link
            href={item.path}
            key={item.path ?? item.label}
          >
            <a className="uppercase text-xs tracking-widest">{item.label}</a>
          </Link>
        )
      } else {
        html.push(
          <div
            key={item.label}
            className="uppercase text-xs tracking-widest"
          >
            <strong>{item.label}</strong>
          </div>
        )
      }
    })

    return html
  }

  return (
     <MuiBreadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" />
        }
        aria-label="breadcrumb"
      >
      {renderSegments()}
    </MuiBreadcrumbs>
  )
}
