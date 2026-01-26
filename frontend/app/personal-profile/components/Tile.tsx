// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

export type TileProps = {
  children: React.ReactNode
  header_title?: string
}

export default function Tile({children, header_title}: TileProps) {

  const tileStyle: string =
    header_title ? 'bg-white rounded-sm w-full gap-4' : 'bg-white rounded-sm w-full p-4 gap-4'

  return (
    <div className={tileStyle}>
      { header_title &&
      <div className="bg-primary text-white text-2xl rounded-t-sm p-4 justify-center content-center px-4 font-bold">
        {header_title}
      </div>
      }
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
