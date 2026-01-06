import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getPersonsList} from '~/components/profile/overview/apiPersonsOverview'
import PersonsOverviewClient from '~/components/profile/overview'

export const metadata: Metadata = {
  title: `Persons | ${app.title}`,
  description: 'Public profiles in RSD.'
}

export default async function PersonsOverviewPage({
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
  // show 404 page if module persons is not enabled
  if (modules?.includes('persons')===false){
    notFound()
  }
  // find basic params
  const {search, rows, page} = ssrBasicParams(params)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // get list of public profiles
  const {count,persons} = await getPersonsList({
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    rows: page_rows,
    searchFor: search,
    // default order by affiliation and name
    orderBy: 'affiliation,display_name',
    token
  })

  const numPages = Math.ceil(count / page_rows)

  // console.group('PersonsOverviewPage')
  // console.log('params...', params)
  // console.log('token...', token)
  // console.log('search...', search)
  // console.log('page_rows...', page_rows)
  // console.log('page...', page)
  // console.log('numPages...', numPages)
  // console.log('persons...', persons)
  // console.groupEnd()

  return (
    <PersonsOverviewClient
      page={page}
      pages={numPages}
      rows={page_rows}
      search={search}
      persons={persons}
    />
  )
}
