// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect} from 'react'
import {Provider} from '~/auth/api/getLoginProviders'
import LoginProviders from '~/components/login/LoginProviders'

type RsdInviteContentProps=Readonly<{
  id: string
  providers: Provider[]
}>
/**
 * This is client side component used to set rsd_pathname cookie which
 * depends on browser location module.
 * @param param0
 * @returns
 */
export default function RsdInviteContent({id,providers}:RsdInviteContentProps) {

  useEffect(()=>{
    if (id){
      // save cookie for auth module
      document.cookie = `rsd_invite_id=${id};path=/auth;SameSite=None;Secure`
      // delay saving cookie to overwrite default action RsdPathnameCookie
      setTimeout(()=>{
        // save cookie to send this user to settings after login
        document.cookie = `rsd_pathname=${location.origin}/user/settings;path=/auth;SameSite=None;Secure`
      },100)
    }
  },[id])

  return (
    <>
      <h1 className="flex-1 pb-8">Register</h1>
      <p>
        To complete your registration please login using one of the providers listed below.
      </p>
      <LoginProviders providers={providers} />
    </>
  )
}
