
// Page title and description metadata

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getAccountFromToken} from '~/auth/jwtUtils'
import {claimProjectMaintainerInvite} from '~/auth/api/authHelpers'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import MaintainerInvitePage from '~/components/invite/MaintainerInvitePage'

// using new app folder approach
export const metadata: Metadata = {
  title: `Project Maintainer Invite | ${app.title}`,
  description: 'Accept project maintainer invitation',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default async function ProjectInvitePage({
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
  if (modules?.includes('projects')===false){
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
  const {projectInfo,error} = await claimProjectMaintainerInvite({
    id: id,
    token
  })
  if (error){
    return (
      <PageErrorMessage {...error}/>
    )
  }

  return (
    <MaintainerInvitePage
      title="Project Maintainer Invite"
      name={projectInfo.title}
      button={{
        href:`/projects/${projectInfo?.slug ?? 'missing'}`,
        label: 'Open project page'
      }}
    />
  )
}
