// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {notFound} from 'next/navigation'

import RsdAdminContent from '~/auth/RsdAdminContent'
import {getUserSettings} from '~/utils/userSettingsApp'
import {getNewsItemBySlug} from '~/components/news/apiNews'
import EditNewsItem from '~/components/news/edit'

export default async function EditNewsItemPage({
  params
}:Readonly<{
  params: Promise<{slug: string, date:string}>,
}>) {

  const [{slug,date},{token}] = await Promise.all([
    params,
    getUserSettings()
  ])

  if (!date || !slug){
    return notFound()
  }

  const newsItem = await getNewsItemBySlug({date, slug, token})
  if (!newsItem){
    return notFound()
  }

  // console.group('EditNewsItemPage')
  // console.log('params...', params)
  // console.log('token...', token)
  // console.log('date...', date)
  // console.log('slug...', slug)
  // console.log('newsItem...', newsItem)
  // console.groupEnd()

  return (
    <RsdAdminContent>
      <EditNewsItem item={newsItem} />
    </RsdAdminContent>
  )
}
