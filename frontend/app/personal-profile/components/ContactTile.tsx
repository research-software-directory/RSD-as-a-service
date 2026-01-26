// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import Tile from './Tile'

export type ContactEntry = {
  value: string,
  icon: JSX.Element,
  href?: string
}

type ContactTileProps = {
  entries: ContactEntry[]
}

export default function ContactTile({entries}: ContactTileProps) {
  return (
    <Tile header_title='CONTACT'>
    <div className="h-[30vh] flex flex-col gap-4">
      {entries.map((entry) => {
        return (
          <div key={entry.value} className="m-4 flex flex-row gap-4 content-center">
            {entry.icon}
            {entry.href ? <a href={entry.href}>{entry.value}</a> : entry.value}
          </div>
        )
      })}
    </div>
    </Tile>
  )
}
