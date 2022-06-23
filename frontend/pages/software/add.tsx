// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedContent from '../../auth/ProtectedContent'
import AppHeader from '~/components/AppHeader'
import PageContainer from '../../components/layout/PageContainer'
import AppFooter from '../../components/layout/AppFooter'

// import AddSoftwareModal from '../../components/software/add/AddSoftwareModal'
import AddSoftwareCard from '../../components/software/add/AddSoftwareCard'

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
          <AddSoftwareCard />
        </PageContainer>
      </ProtectedContent>
      <AppFooter />
    </>
  )
}
