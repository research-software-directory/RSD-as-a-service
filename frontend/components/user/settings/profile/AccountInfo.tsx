// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import LaunchIcon from '@mui/icons-material/Launch'

import {useSession} from '~/auth'
import {useUserContext} from '~/components/user/context/UserContext'
import {findOrcidInLogin} from './apiLoginForAccount'

export default function AccountInfo() {
  const {user} = useSession()
  const {profile,logins} = useUserContext()
  const orcid = findOrcidInLogin(logins)

  return (
    <div className="flex flex-wrap gap-12 text-base-content-secondary pt-4 pb-12">
      <div>
        <div>Profile id</div>
        {user?.account ?? ''}
      </div>
      <div>
        <div>Role</div>
        {user?.role ?? ''}
      </div>
      <div>
        <div>Public Profile</div>
        {profile.is_public === true && orcid ?
          <a href={`/profile/${orcid}/software`} className="flex gap-2 items-center" target='_blank'>
            Enabled <LaunchIcon sx={{width:'1rem'}}/>
          </a>
          :<span>Disabled (<a href="/documentation/users/user-settings/#public-profile" target='_blank'>how to enable? <LaunchIcon sx={{width:'1rem'}}/></a>)</span>
        }
      </div>
    </div>
  )
}
