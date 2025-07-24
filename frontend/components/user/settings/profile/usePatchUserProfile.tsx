// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useFormContext} from 'react-hook-form'
import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useUserContext} from '~/components/user/context/UserContext'
import {patchUserProfile, UserProfile} from './apiUserProfile'

export type OnSaveProps<T> = {
  name: keyof T,
  value: string | boolean
}

export default function usePatchUserProfile() {
  const {token} = useSession()
  const {profile, updateUserProfile} = useUserContext()
  const {showErrorMessage} = useSnackbar()
  const {resetField} = useFormContext()

  async function saveProfileInfo({name, value}: OnSaveProps<UserProfile>){
    // console.group('saveProfileInfo')
    // console.log('name...', name)
    // console.log('value...', value)
    // console.log('account...', profile.account)
    // console.groupEnd()
    // debugger
    // patch user_profile table
    const resp = await patchUserProfile({
      account: profile.account,
      data: {
        [name]:value
      },
      token
    })

    if (resp?.status !== 200) {
      showErrorMessage(`Failed to save ${name}. ${resp?.message}`)
    } else {
      // debugger
      updateUserProfile({
        key: name,
        value
      })
      // debugger
      resetField(name, {
        defaultValue:value
      })
    }
  }

  return saveProfileInfo
}
