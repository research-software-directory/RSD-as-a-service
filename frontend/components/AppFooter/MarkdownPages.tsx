// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {RsdLink} from '~/config/rsdSettingsReducer'


export default function MarkdownPages({pages=[]}: {pages: RsdLink[]}) {
  // if no custom markdown pages return null
  if (pages.length === 0) return null

  // render links to markdown pages
  return (
    <>
      {pages.map(page => {
        return (
          <Link
            key={page.slug}
            href={`/page/${page.slug}`}
            className="hover:text-primary"
            passHref>
            {page.title}
          </Link>
        )
      })}
    </>
  )
}
