import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getNewsList} from '~/components/news/apiNews'
import NewsOverview from '~/components/news/overview'

export const metadata: Metadata = {
  title: `News | ${app.title}`,
  description: 'List of RSD news items.'
}

export default async function NewsOverviewPage({
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

  // show 404 page if module is not enabled
  if (modules?.includes('news')===false){
    notFound()
  }
  // find basic params
  const {search, rows, page} = ssrBasicParams(params)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows

  // get news items list to all pages server side
  const {count,news} = await getNewsList({
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    rows: page_rows,
    is_published: token ? false : true, // NOSONAR
    searchFor: search,
    token
  })

  const numPages = Math.ceil(count / page_rows)

  // console.group('NewsOverviewPage')
  // console.log('count...', count)
  // console.log('page...', page)
  // console.log('rows...', page_rows)
  // console.log('search...', search)
  // console.log('news...', news)
  // console.groupEnd()

  return (
    <NewsOverview
      pages={numPages}
      page={page}
      rows={page_rows}
      search={search}
      news={news}
    />
  )
}
