// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import Link from 'next/link'

export type LinksProps = {
  title: string,
  url: string
  icon: React.JSX.Element,
}

export default function Links({links=[]}:{links:LinksProps[]}) {
  try {
    if (links.length === 0) return null

    return (
      <>
        {links.map(item => {
          return (
            <Link
              key={item.url}
              href={item.url}
              passHref
              target="_blank"
            >
              <div className="flex gap-2">{item.icon} {item.title}</div>
            </Link>
          )
        })}
      </>
    )
  } catch (e) {
    return null
  }
}
