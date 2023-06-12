// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import UnderlinedTitle from './UnderlinedTitle'

export type LinksProps = {
  title: string,
  url: string
  icon: JSX.Element,
}

export default function Links({links=[]}:{links:LinksProps[]}) {
  try {
    if (links.length === 0) return null

    return (
      <>
        <UnderlinedTitle title='Links' />
        <ul>
        {links.map(item => {
          return (
            <li
              key={item.url}
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                margin: '0.5rem 0rem'
              }}
            >
            <Link
              key={item.url}
              href={item.url}
              passHref
              target="_blank"
            >
              {item.icon} {item.title}
            </Link>
            </li>
          )
        })}
        </ul>
      </>
    )
  } catch (e) {
    return null
  }
}
