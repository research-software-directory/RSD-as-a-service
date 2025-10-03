import {Suspense} from 'react'
import {notFound} from 'next/navigation'

import ListContentSkeleton from '~/components/layout/ListContentSkeleton'
import UserCommunities from '~/components/user/communities'
import UserOrganisations from '~/components/user/organisations'
import UserProjects from '~/components/user/project'
import ProjectQuality from '~/components/user/project-quality'
import UserSettings from '~/components/user/settings'
import UserSoftware from '~/components/user/software'
import {UserPageId} from '~/components/user/tabs/UserTabItems'

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
