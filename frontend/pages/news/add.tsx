// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import RsdAdminContent from '~/auth/RsdAdminContent'
import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'
import PageContainer from '~/components/layout/PageContainer'
import AddNewsCard from '~/components/news/add/AddNewsCard'

export default function AddNews() {
  return (
    <>
      <AppHeader />
      <PageContainer className="flex-1 flex px-4 py-6 lg:py-12">
        <RsdAdminContent>
          <AddNewsCard />
        </RsdAdminContent>
      </PageContainer>
      <AppFooter />
    </>
  )
}
