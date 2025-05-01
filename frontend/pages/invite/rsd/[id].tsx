// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {GetServerSidePropsContext} from 'next'

import useRsdSettings from '~/config/useRsdSettings'
import MainContent from '~/components/layout/MainContent'
import PageBackground from '~/components/layout/PageBackground'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import LoginProviders from '~/components/login/LoginProviders'
import {Provider, ssrProvidersInfo} from 'pages/api/fe/auth'

type RsdInvitePageProps=Readonly<{
  id: string | null
  providers: Provider[]
}>

export default function RsdInvitePage({id,providers}:RsdInvitePageProps) {
  const {host} = useRsdSettings()

  // console.group('RsdInvitePage')
  // console.log('id...', id)
  // console.log('providers...', providers)
  // console.groupEnd()

  useEffect(()=>{
    if (id){
      // send this user to settings after login
      document.cookie = `rsd_pathname=${location.origin}/user/settings;path=/auth;SameSite=None;Secure`
    }
  },[id])

  return (
    <PageBackground>
      <AppHeader />
      <MainContent className="justify-center items-center">
        {
          id ?
            <section className="bg-base-100 p-12 rounded-md">
              <h1 className="flex-1 pb-8">Register</h1>
              <p>
                To complete your registration please login using one of the providers listed below.
              </p>
              <LoginProviders providers={providers} />
            </section>
            :
            <section>
              <h1 className="flex-1 py-8">Register</h1>
              <p className="text-error font-medium">
                Invalid invitation link. Please contact our support {host?.email ? `at ${host.email}.` : '.'}
              </p>
            </section>
        }
      </MainContent>
      <AppFooter />
    </PageBackground>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract from page-query
  const {params,req,res} = context
  // extract rsd_token
  const token = req?.cookies['rsd_token']
  // extract id
  const id = params?.id?.toString()

  if (id){
    // set rsd_invite_id cookie server side (HttpOnly)
    res.setHeader(
      'Set-Cookie', `rsd_invite_id=${id};Secure;HttpOnly;Path=/auth;SameSite=None;`
    )
  }

  // get list of providers that support INVITE_ONLY
  const providers = await ssrProvidersInfo('INVITE_ONLY')

  return {
    props: {
      id,
      token: token ?? null,
      providers
    }
  }

}
