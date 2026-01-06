import {Suspense} from 'react'
import {notFound} from 'next/navigation'

import {getUserFromToken} from '~/auth/getSessionServerSide'
import NavContentSkeleton from '~/components/layout/NavContentSkeleton'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getCommunityBySlug} from '~/components/communities/apiCommunities'
import {TabKey} from '~/components/communities/tabs/CommunityTabItems'
import CommunitySoftware from '~/components/communities/software'
import CommunitySettingsContent from '~/components/communities/settings'
import AboutCommunity from '~/components/communities/about'

export default async function CommunityPages({
  params,
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | undefined}>,
  params: Promise<{slug: string, tab:TabKey}>,
}>){

  const [{slug,tab},query,{token}] = await Promise.all([
    params,
    searchParams,
    getUserSettings()
  ])
  // extract user from token and verify
  const user = await getUserFromToken(token)

  // find community by slug
  const {community,isMaintainer} = await getCommunityBySlug({
    slug: slug ?? '',
    token: token,
    user
  })
  // if community not found we return 404
  if (community === null){
    notFound()
  }

  // console.group('CommunityPages')
  // console.log('slug...', slug)
  // console.log('tab...', tab)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('community...', community)
  // console.groupEnd()

  switch(tab){
    // same components for all software "types"
    case 'software':
    case 'requests':
    case 'rejected':
      return (
        <CommunitySoftware
          tab={tab}
          queryParams={query}
          communityId={community.id}
          isMaintainer={isMaintainer}
        />
      )
    case 'settings':
      return (
        // Suspense is not support when Javascript is disabled!
        // But to edit settings Javascript is REQUIRED!
        <Suspense fallback={<NavContentSkeleton />}>
          <CommunitySettingsContent isMaintainer={isMaintainer} />
        </Suspense>
      )
    case 'about':
      return <AboutCommunity description={community?.description} />
    default:
      notFound()
  }
}
