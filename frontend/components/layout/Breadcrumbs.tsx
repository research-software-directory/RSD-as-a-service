// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
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
{segments: SlugInfo[]}) {

  if (segments.length === 0) return null

  function renderSegments() {
    const html: any[] = []

    segments.forEach(item => {
      if (item.path) {
        html.push(
          <Link
            title={item.label}
            href={item.path}
            key={item.path ?? item.label}
            className="uppercase text-xs tracking-widest max-w-xs"
          >
            <div className="line-clamp-1 overflow-hidden max-w-[20rem] break-all">{item.label}</div>
          </Link>
        )
      } else {
        html.push(
          <div
            key={item.label}
            title={item.label}
            className="uppercase text-xs tracking-widest line-clamp-1 overflow-hidden max-w-[20rem] break-all"
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
      maxItems={3}
      separator={
        <NavigateNextIcon fontSize="small" />
      }
      aria-label="breadcrumb"
      sx={{
        flex:1
      }}
    >
      {renderSegments()}
    </MuiBreadcrumbs>
  )
}
