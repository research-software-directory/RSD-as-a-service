// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import Link from 'next/link'
import {useEffect} from 'react'
import useRsdSettings from '~/config/useRsdSettings'
import ContentInTheMiddle from '../layout/ContentInTheMiddle'
import BaseSurfaceRounded from '../layout/BaseSurfaceRounded'

export default function LoginFailedBody({errMsg}:Readonly<{errMsg?:string}>) {
  const {host} = useRsdSettings()

  useEffect(()=>{
    if (errMsg){
      // remove cookie after we received message
      document.cookie = 'rsd_login_failure_message=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login/failed; SameSite=Lax'
    }
  },[errMsg])

  return (
    <ContentInTheMiddle>
      <BaseSurfaceRounded className="p-12">
        <h1 className="pb-4">Login failed</h1>
        <p className="py-4">
          Unfortunately, something went wrong during the login process.
        </p>
        {errMsg ?
          <p className="py-4 text-error">
            {errMsg}
          </p>
          : null
        }
        {
          host.email ?
            <p className='pb-8'>If the problem persist please contact us at {host.email}</p>
            :null
        }
        <Link href="/" passHref>
          <u>Homepage</u>
        </Link>
      </BaseSurfaceRounded>
    </ContentInTheMiddle>
  )
}
