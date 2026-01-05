// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState,useEffect} from 'react'

import {useAuth} from './AuthProvider'
import PageErrorMessage from '../components/layout/PageErrorMessage'
import ContentLoader from '../components/layout/ContentLoader'
import {isMaintainerOf} from './permissions/isMaintainerOf'

/**
 * Wrap the content you want to protect in this component.
 * For editing page content (eg. software page) only authenticated MAINTAINERS
 * are allowed to access the content. Components uses isMaintainerOfSoftware
 * to validate if current user is authenticated AND the maintainer of content,
 * based on page slug. NOTE! Slug is optional prop and if not provided the
 * maintainer validation is not performed.
 */
export default function ProtectedContent({children, pageType='software', slug=''}:
{children: any, pageType?:'software'|'project', slug?: string}) {
  const {session} = useAuth()
  // keep maintainer flag
  const [isMaintainer, setIsMaintainer] = useState(false)
  // if slug is provided we need to make api call to check if user
  // is maintainer of the software
  const [status, setStatus] = useState(slug ? 'loading' : session?.status)

  // console.group('ProtectedContent')
  // console.log('pageType...', pageType)
  // console.log('slug...', slug)
  // console.log('status...', status)
  // console.log('expired...', expired)
  // console.log('token...', token)
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  useEffect(() => {
    async function getMaintainerFlag() {
      const maintainer = await isMaintainerOf({
        slug,
        pageType,
        token: session.token,
        account: session.user?.account
      })
      setIsMaintainer(maintainer)
      setStatus(session.status)
    }
    if (slug && session.token && pageType) {
      getMaintainerFlag()
    } else if (session.status !== status) {

      setStatus(session.status)
    }
  },[slug,session,status,pageType])

  // return nothing
  if (status === 'loading') return <ContentLoader />

  // authenticated user not on 'protected' section
  if (status === 'authenticated' && !slug) {
    // logger('ProtectedContent...authenticated user...not protected section', 'info')
    return children
  }

  // rsd_admin has full access
  if (status === 'authenticated' && session.user?.role==='rsd_admin') {
    // logger(`ProtectedContent...authenticated user...maintainer of ${slug}`, 'info')
    return children
  }

  // isMaintainer and is authenticated
  if (status === 'authenticated' && slug && isMaintainer) {
    // logger(`ProtectedContent...authenticated user...maintainer of ${slug}`, 'info')
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

  // authenticated but not maintainer = 403
  return (
    <PageErrorMessage
      status={403}
      message='FORBIDDEN'
    />
  )
}
