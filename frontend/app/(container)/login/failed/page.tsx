import {Metadata} from 'next'
import {cookies} from 'next/headers'

import {app} from '~/config/app'
import LoginFailedBody from '~/components/login/LoginFailedBody'

// using new app folder approach
export const metadata: Metadata = {
  title: `Login failed | ${app.title}`,
  description: 'Login to RSD failed',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function LoginFailedPage() {
  const cookieStore = await cookies()
  const errMsg = cookieStore.get('rsd_login_failure_message')?.value

  // console.group('LoginFailedPage')
  // console.log('errMsg...',errMsg)
  // console.groupEnd()

  return (
    <LoginFailedBody errMsg={errMsg} />
  )
}
