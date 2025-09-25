// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useSearchParams} from 'next/navigation'

import {UserSettingsTab} from './nav/UserSettingsNavItems'
import UserAboutPage from './about'
import UserProfilePage from './profile'
import UserAgreementsPage from './agreements'
import UserAccessTokensPage from './accesstokens'

export default function UserSettingsContent() {
  const searchParams = useSearchParams()
  const settings = searchParams?.get('settings') as UserSettingsTab ?? 'profile' as UserSettingsTab

  switch (settings) {
    case 'about':
      return <UserAboutPage />
    case 'profile':
      return <UserProfilePage />
    case 'agreements':
      return <UserAgreementsPage />
    case 'accesstokens':
      return <UserAccessTokensPage />
    default:
      return <UserProfilePage/>
  }
}
