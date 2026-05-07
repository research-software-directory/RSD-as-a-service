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
import {UserPageId, userPageTitles} from '~/components/user/tabs/UserTabItems'

export async function generateMetadata({params }: {params: Promise<{tab: UserPageId}>}): Promise<Metadata> {
  // read route params
  const {token} = await getUserSettings()
  const user = await getUserFromToken(token)
  const {tab} = await params
  const tabLabel = userPageTitles[tab] ?? ''

  // if user exists we create metadata
  return {
    title: `${tabLabel} | ${user?.name ?? 'User'} | ${app.title}`,
    description: `${tabLabel} pages for ${user?.name ?? 'User'}`
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
