import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getCommunityList} from '~/components/communities/apiCommunities'
import CommunitiesOverviewClient from '~/components/communities/overview'

export const metadata: Metadata = {
  title: `Communities | ${app.title}`,
  description: 'List of RSD communities.'
}

export default async function CommunitiesOverviewPage({
  searchParams
}:Readonly<{
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}>) {
  // extract params, user preferences and active modules
  const [params, {token,rsd_page_rows},modules] = await Promise.all([
    searchParams,
    getUserSettings(),
    getActiveModuleNames()
  ])
  // show 404 page if modules communities or software are not enabled
  if (modules?.includes('communities')===false || modules?.includes('software')===false){
    notFound()
  }
  // find basic params
  const {search, rows, page} = ssrBasicParams(params)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // get communities list
  const {count,communities} = await getCommunityList({
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    rows: page_rows,
    searchFor: search,
    orderBy: 'software_cnt.desc.nullslast,name.asc',
    token
  })

  // console.group('CommunitiesOverviewPage')
  // console.log('params...', params)
  // console.log('token...', token)
  // console.log('search...', search)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.log('page_rows...', page_rows)
  // console.log('count...', count)
  // console.log('communities...', communities)
  // console.groupEnd()

  return (
    <CommunitiesOverviewClient
      count={count ?? 0}
      page={page}
      rows={page_rows}
      communities={communities}
      search={search}
    />
  )
}
