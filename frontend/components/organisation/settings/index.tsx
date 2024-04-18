// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedOrganisationPage from '../ProtectedOrganisationPage'
import UserAgreementModal from '~/components/user/settings/UserAgreementModal'
import useOrganisationContext from '../context/useOrganisationContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import SettingsNav from './SettingsNav'
import SettingsPageContent from './SettingsPageContent'

// const formId='organisation-settings-form'

export default function OrganisationSettings() {
  const {isMaintainer} = useOrganisationContext()

  return (
    <ProtectedOrganisationPage
      isMaintainer={isMaintainer}
    >
      <UserAgreementModal />
      <div className="flex-1 grid grid-cols-[1fr,4fr] gap-4">
        <BaseSurfaceRounded
          className="mb-12 p-4"
        >
          <SettingsNav />
        </BaseSurfaceRounded>
        {/* dynamic load of settings page */}
        <SettingsPageContent />
      </div>
    </ProtectedOrganisationPage>
  )
}
