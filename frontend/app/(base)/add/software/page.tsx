// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import ProtectedContent from '~/auth/ProtectedContent'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import AddSoftwareCard from '~/components/software/add/AddSoftwareCard'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'

// Page title and description metadata
// using new app folder approach
export const metadata: Metadata = {
  title: `Add software | ${app.title}`,
  description: 'Create software page in the RSD',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function AddSoftwarePage() {
  // check module is active
  const modules = await getActiveModuleNames()
  // do not show software overview if module is not enabled
  if (modules?.includes('software')===false){
    return notFound()
  }

  return (
    <ProtectedContent>
      <UserAgreementModal />
      <AddSoftwareCard />
    </ProtectedContent>
  )
}
