// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import PageErrorMessage from '../layout/PageErrorMessage'

type ProtectOrganisationPageProps={
  children: any,
  isMaintainer: boolean
}

export default function ProtectedOrganisationPage({children,isMaintainer}:ProtectOrganisationPageProps) {
  const {status,user} = useSession()
  // not authenticated
  if (status !== 'authenticated') {
    return (
      <PageErrorMessage
        status={401}
        message='UNAUTHORIZED'
      />
    )
  }
  // authenticated but not the maintainer or rsd_admin = 403
  if (status === 'authenticated' &&
    user?.role !== 'rsd_admin' &&
    isMaintainer === false) {
    return (
      <PageErrorMessage
        status={403}
        message='FORBIDDEN'
      />
    )
  }
  // authenticated mantainer or rsd_admin
  // can see the content (children)
  return children
}
