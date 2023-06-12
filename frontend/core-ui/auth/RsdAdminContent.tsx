// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useAuth} from '~/auth'
import logger from '~/utils/logger'
import ContentLoader from '~/components/layout/ContentLoader'
import PageErrorMessage from '~/components/layout/PageErrorMessage'

export default function RsdAdminContent({children}:{children:any}) {
  const {session} = useAuth()
  // if slug is provided we need to make api call to check if user
  // is maintainer of the software
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
    logger('RsdAdminContent...authenticated user...protected section', 'info')
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
