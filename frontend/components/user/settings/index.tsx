// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import UserSettingsNav from './nav'
import UserSettingsContent from './UserSettingsContent'

export default function UserSettings() {
  return (
    <div className="flex-1 md:grid md:grid-cols-[1fr_3fr] lg:grid-cols-[1fr_4fr] gap-4">
      <BaseSurfaceRounded
        className="p-4"
      >
        <UserSettingsNav />
      </BaseSurfaceRounded>
      {/* dynamic load of settings page */}
      <BaseSurfaceRounded
        className="p-8"
        type='section'
        aria-label = "Main content"
      >
        <UserSettingsContent />
      </BaseSurfaceRounded>
    </div>
  )
}
