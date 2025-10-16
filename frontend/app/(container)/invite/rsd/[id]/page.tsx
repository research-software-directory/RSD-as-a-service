
// Page title and description metadata

import {Metadata} from 'next'

import {app} from '~/config/app'
import {getLoginProviders} from '~/auth/api/getLoginProviders'
import {getRsdSettings} from '~/config/getSettingsServerSide'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import RsdInviteContent from '~/components/invite/RsdInviteContent'

// using new app folder approach
export const metadata: Metadata = {
  title: `Register | ${app.title}`,
  description: 'Register as member of RSD',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function RsdInvitePage({
  params
}:Readonly<{
  params: Promise<{id: string}>,
}>) {
  // get id, cookies, login provides and settings
  const [{id},loginProviders,settings] = await Promise.all([
    params,
    getLoginProviders(),
    getRsdSettings(),
  ])

  if (!id){
    const emailText = settings?.host?.email ? ` at ${settings?.host.email}.` : '.'
    return (
      <PageErrorMessage
        status={400}
        message={`Invalid invitation link. Please contact our support${emailText}`}
      />
    )
  }

  // filter out invite providers
  const inviteOnlyProviders = loginProviders.filter(p => p.accessType === 'INVITE_ONLY' || p.openidProvider === 'helmholtz')

  return (
    <RsdInviteContent
      id={id}
      providers={inviteOnlyProviders}
    />
  )
}
