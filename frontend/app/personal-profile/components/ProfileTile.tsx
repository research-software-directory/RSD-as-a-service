// SPDX-FileCopyrightText: 2025 - 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 - 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import Tile from './Tile'
import UserAvatar from '~/components/user/metadata/UserAvatar'

type ProfileTileProps = {
  profile_id: string
  first_name?: string
  last_name?: string
  role?: string
  affiliation?: string
}

export default function ProfileTile({profile_id, first_name, last_name, role, affiliation}: ProfileTileProps) {
  return (
    <Tile>
      <div className="h-[40vh] flex flex-col items-center">
        {profile_id}
        <div className="w-95">
          <p className="text-2xl font-bold">{first_name} {last_name}</p>
          <p className="text-xl">{role}</p>
          <p className=" text-lg font-bold text-primary">@{affiliation}</p>
        </div>
      </div>
    </Tile>
  )
}
