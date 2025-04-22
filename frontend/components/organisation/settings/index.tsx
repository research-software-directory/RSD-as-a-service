// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import useOrganisationContext from '../context/useOrganisationContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import SettingsNav from './SettingsNav'
import SettingsPageContent from './SettingsPageContent'
import ProtectedContent from '~/components/layout/ProtectedContent'


export default function OrganisationSettings() {
  const {isMaintainer} = useOrganisationContext()
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
        {/* dynamic load of settings page */}
        <SettingsPageContent />
      </div>
    </ProtectedContent>
  )
}
