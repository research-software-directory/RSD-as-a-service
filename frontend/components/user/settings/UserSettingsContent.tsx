// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import {UserSettingsTab} from './nav/UserSettingsNavItems'
import UserAboutPage from './about'
import UserProfilePage from './profile'
import UserAgreementsPage from './agreements'

export default function UserSettingsContent() {
  const router = useRouter()
  const settings = router.query['settings']?.toString() as UserSettingsTab ?? 'profile' as UserSettingsTab

  switch (settings) {
    case 'about':
      return <UserAboutPage />
    case 'profile':
      return <UserProfilePage />
    case 'agreements':
      return <UserAgreementsPage />
    default:
      return <UserProfilePage/>
  }
}
