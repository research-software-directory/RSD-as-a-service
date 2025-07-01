// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import RsdAdminContent from '~/auth/RsdAdminContent'
import {getRsdModules} from '~/config/getSettingsServerSide'
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

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps() {
  // check module is active
  const modules = await getRsdModules()
  // do not show software overview if module is not enabled
  if (modules?.includes('news')===false){
    return {
      notFound: true
    }
  }
  return {
    props:{
      modules
    }
  }
}
