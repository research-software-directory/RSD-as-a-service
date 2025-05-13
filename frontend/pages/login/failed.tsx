// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre for Environmental Research (UFZ)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Link from 'next/link'

import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import useRsdSettings from '~/config/useRsdSettings'

export default function LoginFailed() {
  const {host} = useRsdSettings()
  const [errorMessage, setErrorMessage] = useState<string>()

  useEffect(() => {
    const errorCookie = document.cookie.split(';')
      .find(cookie => cookie.trim().startsWith('rsd_login_failure_message='))

    if (errorCookie) {
      setErrorMessage(errorCookie.replace('rsd_login_failure_message=', ''))
      document.cookie = 'rsd_login_failure_message=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/login/failed; SameSite=Lax'
    }
  }, [])

  return (
    <ContentInTheMiddle>
      <div className="border p-12">
        <h1 className="pb-4">Login failed</h1>
        <p className="py-4">
          Unfortunately, something went wrong during the login process.
        </p>
        {errorMessage && <p className="py-4 text-error">
          {errorMessage}
        </p>}
        {
          host.email ?
            <p className='pb-8'>If the problem persist please contact us at {host.email}</p>
            :null
        }

        <Link href="/" passHref>
          <u>Homepage</u>
        </Link>
      </div>
    </ContentInTheMiddle>
  )
}
