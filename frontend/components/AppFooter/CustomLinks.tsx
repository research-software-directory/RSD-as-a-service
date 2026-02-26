// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {CustomLink} from '~/config/rsdSettingsReducer'

export default function CustomLinks({links=[]}:{links:CustomLink[]}) {
  // if no custom markdown pages return null
  if (links.length === 0) return null

  // render links to markdown pages
  return (
    <>
      {links.map(link => {
        return (
          <a
            key={link.url}
            href={link.url}
            target={link.target}
            rel="noreferrer">
            {link.label}
          </a>
        )
      })}
    </>
  )
}
