// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedContent from '~/auth/ProtectedContent'
import AppHeader from '~/components/AppHeader'
import PageContainer from '~/components/layout/PageContainer'
import AppFooter from '~/components/AppFooter'
import AddSoftwareCard from '~/components/software/add/AddSoftwareCard'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'

/**
 * Add new software. This page is only showing a modal with 2 fields:
 * title and short_statement. All "action" is stored in AddSoftwareModal
 */
export default function AddSoftware() {
  return (
    <>
      <AppHeader />
      <ProtectedContent>
        <PageContainer className="flex-1 px-4 py-6 lg:py-12">
          <UserAgreementModal />
          <AddSoftwareCard />
        </PageContainer>
      </ProtectedContent>
      <AppFooter />
    </>
  )
}
