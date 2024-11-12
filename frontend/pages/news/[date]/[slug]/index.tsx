// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import {useSession} from '~/auth'
import {NewsItem, getNewsItemBySlug} from '~/components/news/apiNews'
import PageMeta from '~/components/seo/PageMeta'
import OgMetaTags from '~/components/seo/OgMetaTags'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import ReactMarkdownWithSettings from '~/components/layout/ReactMarkdownWithSettings'
import NewsItemNav from '~/components/news/item/NewsItemNav'
import NewsItemHeader from '~/components/news/item/NewsItemHeader'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {NavButtons} from '~/components/news/item/NavButtons'
import PageBackground from '~/components/layout/PageBackground'
import MainContent from '~/components/layout/MainContent'

export default function NewsItemPage({newsItem}:{newsItem:NewsItem}) {
  const pageTitle = `${newsItem.title} | ${app.title}`
  const {user,token} = useSession()
  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={newsItem?.summary ?? ''}
      />
      {/* Page Head meta tags */}
      <OgMetaTags
        title={pageTitle}
        description={newsItem?.summary ?? ''}
      />
      <CanonicalUrl/>
      <PageBackground>
        <AppHeader />
        <MainContent className="lg:w-[64rem] lg:mx-auto pb-12">
          {/* BREADCRUMBS and button */}
          <NewsItemNav
            slug={newsItem.slug}
          >
            <NavButtons
              id={newsItem.id}
              slug={`${newsItem.publication_date}/${newsItem.slug}`}
              title={newsItem.title}
              image_for_news={newsItem.image_for_news}
              isMaintainer={user?.role==='rsd_admin'}
              token={token}
            />
          </NewsItemNav>
          {/* ARTICLE header (title,subtitle,date and author) */}
          <section className="p-8 bg-base-100 rounded-lg relative">
            <NewsItemHeader
              title={newsItem.title}
              publication_date={newsItem.publication_date}
              author={newsItem.author}
            />
            {/* ARTICLE BODY (markdown) */}
            <ReactMarkdownWithSettings
              markdown={newsItem.description}
              className='pt-4 md:pt-8 px-1 max-w-3xl'
            />
          </section>
        </MainContent>
        <AppFooter />
      </PageBackground>
    </>
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

    // News item found in DB
    if (newsItem){
      return {
        props: {
          newsItem
        },
      }
    }

    // otherwise not found
    return {
      notFound: true,
    }

  }catch{
    return {
      notFound: true,
    }
  }
}
