// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {getOrganisationsList} from '~/components/organisation/apiOrganisations'
import OrganisationOverviewClient from '~/components/organisation/overview/OrganisationOverviewClient'

export const metadata: Metadata = {
  title: `Organisations | ${app.title}`,
  description: 'List of organizations involved in the development of research software.'
}

export default async function OrganisationsOverviewPage({
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
  if (modules?.includes('organisations')===false){
    notFound()
  }
  // find basic params
  const {search, rows, page} = ssrBasicParams(params)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows
  // get organisation list
  const {count, data} = await getOrganisationsList({
    search,
    rows: page_rows,
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    token,
  })

  // console.group('OrganisationsOverviewPage')
  // console.log('params...', params)
  // console.log('token...', token)
  // console.log('search...', search)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.log('page_rows...', page_rows)
  // console.log('organisations count...', count)
  // console.log('organisations...', data)
  // console.groupEnd()

  return (
    <OrganisationOverviewClient
      count={count ?? 0}
      page={page}
      rows={page_rows}
      organisations={data}
      search={search}
    />
  )
}
