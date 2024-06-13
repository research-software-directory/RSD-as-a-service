// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {RsdRole, Session} from '~/auth'
import logger from '~/utils/logger'
import PageErrorMessage from './PageErrorMessage'
import ContentLoader from './ContentLoader'

type ProtectedContentProps={
  children: any,
  isMaintainer: boolean
  status: Session['status']
  role?: RsdRole
}

export default function ProtectedContent({status,role,children,isMaintainer}:ProtectedContentProps) {
  // LOADING
  if (status === 'loading') {
    logger('ProtectedContent...loading...', 'info')
    return <ContentLoader />
  }

  // rsd_admin has full access
  if (status === 'authenticated' && role==='rsd_admin') {
    logger('ProtectedContent...authenticated user...rsd_admin', 'info')
    return children
  }

  // authenticated maintainer has access
  if (status === 'authenticated' && isMaintainer===true) {
    logger('ProtectedContent...authenticated user...isMaintainer', 'info')
    return children
  }

  // 403 FORBIDDEN
  if (status === 'authenticated' && isMaintainer===false){
    logger('ProtectedContent...403...FORBIDDEN', 'info')
    return (
      <PageErrorMessage
        status={403}
        message='FORBIDDEN'
      />
    )
  }

  // ELSE 401
  logger('ProtectedContent...401...FORBIDDEN', 'info')
  return (
    <PageErrorMessage
      status={401}
      message='UNAUTHORIZED'
    />
  )
}
