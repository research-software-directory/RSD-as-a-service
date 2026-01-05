// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'

import {useAuth} from './AuthProvider'
import ContentLoader from '~/components/layout/ContentLoader'
import PageErrorMessage from '~/components/layout/PageErrorMessage'

export default function RsdAdminContent({children}:{children:any}) {
  const {session} = useAuth()
  const [status, setStatus] = useState(session?.status ? session?.status :'loading')

  useEffect(() => {
    // sync local status

    if (status!==session.status) setStatus(session.status)
  },[session.status,status])

  // return nothing
  if (status === 'loading') return <ContentLoader />

  // authenticated rsd_admin
  if (status === 'authenticated' &&
    session.token &&
    session.user?.role === 'rsd_admin') {
    return children
  }

  // not authenticated
  if (status !== 'authenticated') {
    return (
      <PageErrorMessage
        status={401}
        message='UNAUTHORIZED'
      />
    )
  }

  // authenticated but not rsd_admin = 403
  return (
    <PageErrorMessage
      status={403}
      message='FORBIDDEN'
    />
  )

}
