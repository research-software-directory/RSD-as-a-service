// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {getRsdTokenNode, useSession} from '~/auth'
import MainContent from '~/components/layout/MainContent'
import PageBackground from '~/components/layout/PageBackground'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import LoginProviders from '~/components/login/LoginProviders'
import {Provider, ssrProvidersInfo} from 'pages/api/fe/auth'

export default function LoginPage({providers}:Readonly<{providers:Provider[]}>) {
  const {status} = useSession()

  // console.group('LoginPage')
  // console.log('status...',status)
  // console.log('providers...', providers)
  // console.groupEnd()

  if (status === 'loading') {
    return null
  }

  return (
    <PageBackground>
      <AppHeader />
      <MainContent className="justify-center items-center">
        <section className="bg-base-100 p-12 rounded-md">
          <h1 className="flex-1">Sign in with</h1>
          <LoginProviders providers={providers} />
        </section>
      </MainContent>
      <AppFooter />
    </PageBackground>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {req} = context
  // get token
  const token = getRsdTokenNode(req)

  // USER already logged in
  if (token){
    // get last visited path
    const redirect = req.cookies['rsd_pathname']
    // redirect to last visited page
    return {
      redirect: {
        destination: redirect ?? '/',
        permanent: false
      },
    }
  }

  // get list of available providers
  const providers = await ssrProvidersInfo()

  // if no providers we show 404 page
  if (providers?.length === 0){
    return {
      notFound: true
    }
  }else if (providers?.length === 1 && providers[0]?.redirectUrl){
    // when only 1 provider we redirect directly
    return {
      redirect: {
        destination: providers[0]?.redirectUrl,
        permanent: false
      },
    }
  }

  // finally we pass list of providers to FE
  return {
    props:{
      providers
    }
  }
}
