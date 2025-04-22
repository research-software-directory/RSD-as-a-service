// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {FormProvider, useForm} from 'react-hook-form'

import {useUserContext} from '~/components/user/context/UserContext'
import {UserProfile} from './apiUserProfile'
import AuthenticationMethods from './AuthenticationMethods'
import AccountInfo from './AccountInfo'
import ProfileInput from './ProfileInput'
import LinkAccounts from './LinkAccounts'

export default function UserProfilePage() {
  const {profile} = useUserContext()
  const methods = useForm<UserProfile>({
    mode: 'onChange',
    defaultValues: profile
  })

  return (
    <>
      <h2 data-testid="user-profile-page-title" className="mb-8">Profile</h2>

      <FormProvider {...methods}>
        <form
          autoComplete="off"
        >
          {/* hidden inputs */}
          <input type="hidden"
            {...methods.register('account')}
          />

          {/* PROFILE INPUTS */}
          <ProfileInput />

          {/* AUTHENTICATION AND LINKING */}
          <div className="grid lg:grid-cols-2 gap-8 pt-12">
            <AuthenticationMethods />
            <LinkAccounts />
          </div>
        </form>
      </FormProvider>
      <AccountInfo />
    </>
  )
}
