// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import LaunchIcon from '@mui/icons-material/Launch'
import {useFormContext} from 'react-hook-form'
import {UserSettingsType} from './useUserAgreements'

type BasicProfileProps={
  orcid?:string
}

export default function BasicProfile({orcid}:BasicProfileProps) {
  const {user} = useSession()
  // FormProvider context at parent is REQUIRED
  const {watch} = useFormContext<UserSettingsType>()
  const [public_orcid_profile]=watch(['public_orcid_profile'])

  // console.group('BasicProfile')
  // console.log('public_orcid_profile...', public_orcid_profile)
  // console.groupEnd()

  return (
    <>
      <h2>Your profile properties</h2>
      <div className="py-4">
        <div>Profile id</div>
        {user?.account ?? ''}
      </div>
      <div className="py-4">
        <div>Role</div>
        {user?.role ?? ''}
      </div>
      <div className="py-4">
        <div>Public profile</div>
        {public_orcid_profile === true && orcid ?
          <a href={`/profile/${orcid}/software`} className="flex gap-2 items-center" target='_blank'>
            Enabled <LaunchIcon sx={{width:'1rem'}}/>
          </a>
          :
          <span>Disabled (<a href="/documentation/users/user-settings/#public-profile" target='_blank'>how to enable? <LaunchIcon sx={{width:'1rem'}}/></a>)</span>
        }
      </div>
    </>
  )
}
