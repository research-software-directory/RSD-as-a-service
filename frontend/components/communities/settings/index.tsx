// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
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
      <div className="flex-1 grid grid-cols-[1fr_4fr] gap-4">
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
