// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import Tile from './Tile'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'

type AboutTileProps = {
  given_names: string
  family_names: string
  description?: string
}

export default function AboutTile({given_names, family_names, description}: AboutTileProps) {
  return (
    <Tile>
      <div className="text-lg min-h-[25vh]">
        <div className="text-2xl">
          <span className="font-bold">About </span>
          {given_names} {family_names}
        </div>
        <ReactMarkdownWithSettings markdown={description ?? '*Currently no description provided.*'}/>
      </div>
    </Tile>

  )
}
