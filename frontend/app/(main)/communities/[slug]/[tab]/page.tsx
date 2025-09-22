import {notFound} from 'next/navigation'

import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettingsApp'
import {getCommunityBySlug} from '~/components/communities/apiCommunities'
import {TabKey} from '~/components/communities/tabs/CommunityTabItems'
import CommunitySoftware from '~/components/communities/software'
import CommunitySettingsContent from '~/components/communities/settings'
import AboutCommunity from '~/components/communities/about'

export default async function CommunityPages({
  params,
  searchParams
}:Readonly<{
  searchParams: Promise<{ [key: string]: string | undefined }>,
  params: Promise<{slug: string, tab:TabKey}>,
}>){

  const [{slug,tab},query,{token}] = await Promise.all([
    params,
    searchParams,
    getUserSettings()
  ])

  const user = getUserFromToken(token ?? null)

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
      return <CommunitySettingsContent isMaintainer={isMaintainer} />
    case 'about':
      return <AboutCommunity description={community?.description} />
    default:
      notFound()
  }
}
