import {Metadata} from 'next'
import {cookies} from 'next/headers'
import {notFound, redirect, RedirectType} from 'next/navigation'

import {app} from '~/config/app'
import {getLoginProviders} from '~/auth/api/getLoginProviders'
import LoginProviders from '~/components/login/LoginProviders'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'

// using new app folder approach
export const metadata: Metadata = {
  title: `Login | ${app.title}`,
  description: 'Login to RSD',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function LoginPage() {
  // get token
  const cookieStore = await cookies()
  const rsd_token = cookieStore.get('rsd_token')?.value

  // console.group('LoginPage')
  // console.log('rsd_token...', rsd_token)
  // console.groupEnd()

  // if user is already logged in
  if (rsd_token){
    // we redirect user his personal page
    return redirect('/user/settings', RedirectType.replace)
  }

  // get list of available providers
  const providers = await getLoginProviders()

  // if no providers we show 404
  if (providers.length===0){
    return notFound()
  }

  // if only provider we redirect to login page of provider
  if (providers?.length === 1 && providers[0]?.signInUrl){
    return redirect(providers[0]?.signInUrl)
  }

  return(
    <ContentInTheMiddle>
      <BaseSurfaceRounded className="p-12">
        <h1 className="flex-1">Sign in with</h1>
        <LoginProviders providers={providers} />
      </BaseSurfaceRounded>
    </ContentInTheMiddle>
  )
}
