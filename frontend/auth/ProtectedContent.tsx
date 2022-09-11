// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {useAuth} from '.'

import PageErrorMessage from '../components/layout/PageErrorMessage'
import ContentLoader from '../components/layout/ContentLoader'
import {isMaintainerOfSoftware} from './permissions/isMaintainerOfSoftware'
import {isMaintainerOfProject} from './permissions/isMaintainerOfProject'
import logger from '~/utils/logger'

type isMaintainerProps = {
  slug: string,
  account?: string,
  token: string,
  pageType: 'software'|'project'
}

let isMaintainer = false
let lastSlug = ''
let lastAccount = ''
let lastPageType = ''
let lastToken = ''

async function isMaintainerOf({slug, account, token, pageType}: isMaintainerProps) {
try {
  if (typeof account == 'undefined') return false
  if (slug === '') return false
  if (token === '') return false

  if (lastSlug === slug &&
    lastAccount === account &&
    lastPageType === pageType &&
    lastToken === token
  ) {
    // return last value for this user?
    // console.log('isMaintainerOf...(cached)...', isMaintainer)
    return isMaintainer
  }

  switch (pageType) {
    case 'project':
      isMaintainer = await isMaintainerOfProject({
        slug,
        account,
        token
      })
      break
    default:
      // software is default for now
      isMaintainer = await isMaintainerOfSoftware({
        slug,
        account,
        token
      })
  }
  // update last values
  lastSlug = slug
  lastAccount = account
  lastPageType = pageType
  lastToken = token
  // debugger
  return isMaintainer
} catch (e: any) {
  logger(`isMaintainer error ${e?.message}`, 'error')
  return false
}}


/**
 * Wrap the content you want to protect in this component.
 * For editing page content (eg. software page) only authenticated MAINTAINERS
 * are allowed to access the content. Components uses isMaintainerOfSoftware
 * to validate if current user is authenticated AND the maintainer of content,
 * based on page slug. NOTE! Slug is optional prop and if not provided the
 * maintainer validation is not performed.
 */
export default function ProtectedContent({children, pageType='software', slug}:
  { children: any, pageType?:'software'|'project', slug?: string }) {
  const {session} = useAuth()
  // keep maintainer flag
  const [isMaintainer, setIsMaintainer] = useState(false)
  // if slug is provided we need to make api call to check if user
  // is maintainer of the software
  const [status, setStatus] = useState(slug ? 'loading' : session?.status)

  useEffect(() => {
    let abort = false
    if (slug && session.token) {
      setStatus('loading')
      if (pageType === 'project') {
        // validate if user is maintainer
        // of this project
        isMaintainerOfProject({
          slug,
          account: session?.user?.account ?? '',
          token: session?.token
        }).then(resp => {
          // stop on abort
          if (abort) return
          // update states
          setIsMaintainer(resp)
          setStatus(session.status)
        })
      } else {
        // validate if user is maintainer
        // of this software
        isMaintainerOfSoftware({
          slug,
          account: session?.user?.account ?? '',
          token: session?.token
        }).then(resp => {
          // stop on abort
          if (abort) return
          // update states
          setIsMaintainer(resp)
          setStatus(session.status)
        })
      }
    } else if (session?.status) {
      setStatus(session.status)
    }
    return () => { abort = true }
  }, [slug, pageType, session.token, session?.user?.account, session?.user?.role, session.status])

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
