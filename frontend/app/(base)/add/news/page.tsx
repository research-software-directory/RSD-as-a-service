// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import RsdAdminContent from '~/auth/RsdAdminContent'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import AddNewsCard from '~/components/news/add/AddNewsCard'

// Page title and description metadata
// using new app folder approach
export const metadata: Metadata = {
  title: `Add news | ${app.title}`,
  description: 'Create news page in the RSD',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function AddNewsPage() {
  // check module is active
  const modules = await getActiveModuleNames()
  // do not show software overview if module is not enabled
  if (modules?.includes('news')===false){
    return notFound()
  }

  return (
    <RsdAdminContent>
      <AddNewsCard />
    </RsdAdminContent>
  )
}
