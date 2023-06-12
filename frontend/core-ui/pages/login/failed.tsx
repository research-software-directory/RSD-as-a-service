// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre for Environmental Research (UFZ)
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import ContentInTheMiddle from '../../components/layout/ContentInTheMiddle'
import {useEffect} from 'react'
import {useState} from 'react'

export default function LoginFailed() {
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
        <h1>Login failed</h1>
        <p className="py-8">
          Unfortunately, something went wrong during the login process.
        </p>
        {errorMessage && <p className="pb-8 text-error">
          {errorMessage}
        </p>}
        <Link href="/" passHref>
          Homepage
        </Link>
      </div>
    </ContentInTheMiddle>
  )
}
