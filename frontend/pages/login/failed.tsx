// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import ContentInTheMiddle from '../../components/layout/ContentInTheMiddle'

export default function LoginFailed() {
  return (
    <ContentInTheMiddle>
      <div className="border p-12">
        <h1>Login failed</h1>
        <p className="py-8">
          Unfortunatelly, something went wrong during the login process
        </p>
        <Link href="/" passHref>
          <a>Go home</a>
          </Link>
      </div>
    </ContentInTheMiddle>
  )
}
