// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import Head from 'next/head'

import {app} from '~/config/app'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {NewsItem, getNewsItemBySlug} from '~/components/news/apiNews'
import EditNewsItem from '~/components/news/edit'

const pageTitle = `Edit news | ${app.title}`

export default function EditNewsPage({newsItem}:{newsItem:NewsItem}) {

  // console.group('EditNewsPage')
  // console.log('newsItem...', newsItem)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <RsdAdminContent>
        <EditNewsItem item={newsItem} />
      </RsdAdminContent>
    </DefaultLayout>
  )
}

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {req,query} = context
    const token = req?.cookies['rsd_token']
    const slug = query['slug']?.toString()
    const date = query['date']?.toString()

    // get news items list to all pages server side
    let newsItem = null
    if (date && slug){
      newsItem = await getNewsItemBySlug({date, slug, token})
    }

    if (newsItem===null){
      return {
        notFound: true,
      }
    }

    return {
      // passed to the page component as props
      props: {
        newsItem
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
