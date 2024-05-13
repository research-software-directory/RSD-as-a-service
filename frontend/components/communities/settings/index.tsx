// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import UserAgreementModal from '~/components/user/settings/UserAgreementModal'
import ProtectedContent from '~/components/layout/ProtectedContent'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import SettingsNav from './SettingsNav'
import SettingsContent from './SettingsContent'

export default function CommunitySettingsContent({isMaintainer}:{isMaintainer:boolean}) {
  const {status,user} = useSession()

  return (
    <ProtectedContent
      status={status}
      role={user?.role}
      isMaintainer={isMaintainer}
    >
      <UserAgreementModal />
      <div className="flex-1 grid grid-cols-[1fr,4fr] gap-4">
        <BaseSurfaceRounded
          className="mb-12 p-4"
        >
          <SettingsNav />
        </BaseSurfaceRounded>
        {/* dynamic load of settings tabs */}
        <SettingsContent />
      </div>
    </ProtectedContent>
  )
}
