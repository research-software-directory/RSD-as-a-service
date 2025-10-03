// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {getDisplayName} from '~/utils/getDisplayName'
import PersonalInfo from '~/components/software/PersonalInfo'
import {useUserContext} from '~/components/user/context/UserContext'
import {findProviderSubInLogin} from '~/components/user/settings/profile/apiLoginForAccount'

export default function UserInfo() {
  const {profile,logins} = useUserContext()
  const name = getDisplayName(profile)
  const orcid = findProviderSubInLogin(logins,'orcid')

  // console.group('UserInfo')
  // console.log('name...', name)
  // console.log('profile...', profile)
  // console.log('orcid...', orcid)
  // console.groupEnd()

  return (
    <div>
      <h1
        data-testid="user-settings-h1"
        title={name ?? ''}
        className="text-2xl font-medium line-clamp-1 pb-4">
        {name ?? ''}
      </h1>
      <PersonalInfo
        role={profile?.role}
        affiliation={profile?.affiliation}
        orcid={orcid}
      />
    </div>
  )
}
