// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import MoreIcon from '@mui/icons-material/More'
import {BadgeForSoftware} from '~/types/SoftwareTypes'

export default function SoftwareBadges({badges = []}: Readonly<{badges: BadgeForSoftware[]}>) {
  function renderBadges() {
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {badges.map(badge => {
          const badgeImg = <img key={badge.id} src={badge.badge_url} alt={badge.alt_text ?? ''} className="max-h-[20px]" />
          if (badge.link_url) {
            return <a key={badge.id} href={badge.link_url}>{badgeImg}</a>
          } else {
            return badgeImg
          }
        })}
      </div>
    )
  }

  if (!badges?.length) {
    return null
  }

  return (
    <div>
      <div className="pb-2">
        <MoreIcon color="primary" />
        <span className="text-primary pl-2">Badges</span>
      </div>
      {renderBadges()}
    </div>
  )
}
