// SPDX-FileCopyrightText: 2026 Diego Alonso Alvarez (Imperial College London) <d.alonso-alvarez@imperial.ac.uk>
// SPDX-FileCopyrightText: 2026 Imperial College London
//
// SPDX-License-Identifier: Apache-2.0

import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import {Metadata} from 'next'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth/getSessionServerSide'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import ListContentSkeleton from '~/components/layout/ListContentSkeleton'
import UserCommunities from '~/components/user/communities'
import UserOrganisations from '~/components/user/organisations'
import UserProjects from '~/components/user/project'
import ProjectQuality from '~/components/user/project-quality'
import UserSettings from '~/components/user/settings'
import UserSoftware from '~/components/user/software'
import {UserPageId, userTabItems} from '~/components/user/tabs/UserTabItems'
import {UserSettingsTab, settingsMenu} from '~/components/user/settings/nav/UserSettingsNavItems'

export async function generateMetadata({params,searchParams}: {
  params: Promise<{tab: UserPageId}>
  searchParams: Promise<{settings?: UserSettingsTab}>
}): Promise<Metadata> {
  // read route params
  const {token} = await getUserSettings()
  const user = await getUserFromToken(token)
  const [{tab},{settings}] = await Promise.all([
    params,
    searchParams
  ])
  const tabInfo = userTabItems[tab] ?? 'User'

  // console.group('UserPageRouter.generateMetadata')
  // console.log('tab...', tab)
  // console.log('settings...', settings)
  // console.groupEnd()

  // when settings page we also need to extract settings tab
  if (tab==='settings'){
    // find settings tab
    const settingsTab = settingsMenu.find(item=>item.id===settings)
    const settingTitle = settingsTab?.label() ?? 'Profile'
    return {
      title: `${settingTitle} | ${user?.name ?? 'User'} | ${app.title}`,
      description: `${tabInfo?.pageTitle} pages for ${user?.name ?? 'User'}`
    }
  }

  // other user pages without additional settings tab
  return {
    title: `${tabInfo?.pageTitle} | ${user?.name ?? 'User'} | ${app.title}`,
    description: `${tabInfo?.pageTitle} pages for ${user?.name ?? 'User'}`
  }
}

export default async function UserPageRouter({
  params
}:Readonly<{
  params: Promise<{tab: UserPageId}>,
}>) {

  const {tab} = await params

  // console.group('UserPageRouter')
  // console.log('tab...', tab)
  // console.groupEnd()

  switch(tab){
    case 'software':
      return <UserSoftware />
    case 'projects':
      return <UserProjects />
    case 'organisations':
      return <UserOrganisations />
    case 'communities':
      return <UserCommunities />
    case 'project-quality':
      return (
        <Suspense fallback={<ListContentSkeleton lines={7} />}>
          <ProjectQuality />
        </Suspense>
      )
    case 'settings':
      return <UserSettings />
    default:
      return notFound()
  }

}
