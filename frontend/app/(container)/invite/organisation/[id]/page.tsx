
// Page title and description metadata

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getAccountFromToken} from '~/auth/jwtUtils'
import {claimOrganisationMaintainerInvite} from '~/auth/api/authHelpers'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import MaintainerInvitePage from '~/components/invite/MaintainerInvitePage'
import {getRsdPathForOrganisation} from '~/components/organisation/apiEditOrganisation'

// using new app folder approach
export const metadata: Metadata = {
  title: `Organisation Maintainer Invite | ${app.title}`,
  description: 'Accept organisation maintainer invitation',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function OrganisationInvitePage({
  params
}:Readonly<{
  params: Promise<{id: string}>,
}>) {
  // check module is active
  const [{id},{token},modules] = await Promise.all([
    params,
    getUserSettings(),
    getActiveModuleNames(),

  ])
  // do not show page if module is not enabled
  if (modules?.includes('organisations')===false){
    return notFound()
  }
  // extract account id from token
  const account = getAccountFromToken(token)
  if (account===undefined){
    return (
      <PageErrorMessage status={401} message="You need to sign in to RSD first!"/>
    )
  }

  // claim the software maintainer invite
  const {organisationInfo,error} = await claimOrganisationMaintainerInvite({
    id: id,
    token
  })
  if (error){
    return (
      <PageErrorMessage {...error}/>
    )
  }

  // get organisation path from uuid
  const resp = await getRsdPathForOrganisation({
    uuid: organisationInfo.id,
    token
  })

  if (resp.status!==200){
    return (
      <PageErrorMessage {...resp} />
    )
  }

  return (
    <MaintainerInvitePage
      title="Organisation Maintainer Invite"
      name={organisationInfo.name}
      button={{
        href:`/organisations/${resp.message ?? 'missing'}`,
        label: 'Open organisation page'
      }}
    />
  )
}
