// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedContent from '~/auth/ProtectedContent'
import {getRsdModules} from '~/config/getSettingsServerSide'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import PageContainer from '~/components/layout/PageContainer'
import AddProjectCard from '~/components/projects/add/AddProjectCard'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'

/**
 * Add new project. This page enables creation of project with 2 fields:
 * title and subtitle. All "action" is stored in AddSoftwareModal
 */
export default function AddProject() {
  return (
    <>
      <AppHeader />
      <ProtectedContent>
        <PageContainer className="flex-1 px-4 py-6 lg:py-12">
          <UserAgreementModal />
          <AddProjectCard />
        </PageContainer>
      </ProtectedContent>
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
  if (modules?.includes('projects')===false){
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
