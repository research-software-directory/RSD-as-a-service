// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {GetServerSidePropsContext} from 'next/types'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'

import {app} from '~/config/app'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getUserSettings, setDocumentCookie} from '~/utils/userSettings'
import PageMeta from '~/components/seo/PageMeta'
import PageBackground from '~/components/layout/PageBackground'
import AppHeader from '~/components/AppHeader'
import MainContent from '~/components/layout/MainContent'
import AppFooter from '~/components/AppFooter'
import SearchInput from '~/components/search/SearchInput'
import useSearchParams from '~/components/search/useSearchParams'
import SelectRows from '~/components/software/overview/search/SelectRows'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import ViewToggleGroup,{ProjectLayoutType} from '~/components/projects/overview/search/ViewToggleGroup'
import NewsGrid from '~/components/news/overview/NewsGrid'
import {NewsListItem, getNewsList} from '~/components/news/apiNews'
import NewsList from '~/components/news/overview/list'

const pageTitle = `News | ${app.title}`
const pageDesc = 'List of RSD news.'

type NewsOverviewProps={
  count: number,
  page: number,
  rows: number,
  layout: LayoutType,
  search?: string,
  news: NewsListItem[]
}

export default function NewsOverview({count,page,rows,layout,search,news}:NewsOverviewProps) {
  const {handleQueryChange,createUrl} = useSearchParams('news')
  const initView = layout === 'masonry' ? 'grid' : layout
  const [view, setView] = useState<ProjectLayoutType>(initView)
  const numPages = Math.ceil(count / rows)

  // console.group('NewsOverview')
  // console.log('count...', count)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('layout...', layout)
  // console.log('view...', view)
  // console.log('search...', search)
  // console.log('news...', news)
  // console.groupEnd()

  function setLayout(view: ProjectLayoutType) {
    // update local view
    setView(view)
    // save to cookie
    setDocumentCookie(view,'rsd_page_layout')
  }

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />

      <PageBackground>
        <AppHeader />

        <MainContent className="py-4">
          {/* Page title with search and pagination */}
          <div className="flex flex-wrap py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
            <h1 role="heading" className="mr-4 lg:flex-1">
              News
            </h1>
            <div className="flex-2 flex min-w-[20rem]">
              <SearchInput
                placeholder="Search news items by title, summary or author"
                onSearch={(search: string) => handleQueryChange('search', search)}
                defaultValue={search ?? ''}
              />
              <ViewToggleGroup
                layout={view}
                onSetView={setLayout}
                sx={{
                  marginLeft:'0.5rem'
                }}
              />
              <SelectRows
                rows={rows}
                handleQueryChange={handleQueryChange}
              />
            </div>
          </div>

          {/* news cards, grid is default */}
          {view === 'list' ?
            <NewsList news={news} />
            :
            <NewsGrid news={news} />
          }

          {/* Pagination */}
          {numPages > 1 &&
            <div className="flex flex-wrap justify-center mb-10">
              <Pagination
                count={numPages}
                page={page}
                renderItem={item => {
                  if (item.page !== null) {
                    return (
                      <a href={createUrl('page', item.page.toString())}>
                        <PaginationItem {...item}/>
                      </a>
                    )
                  } else {
                    return (
                      <PaginationItem {...item}/>
                    )
                  }
                }}
              />
            </div>
          }
        </MainContent>

        {/* App footer */}
        <AppFooter />
      </PageBackground >
    </>
  )
}


// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {req} = context
    const {search, rows, page} = ssrBasicParams(context.query)
    const token = req?.cookies['rsd_token']

    // extract user settings from cookie
    const {rsd_page_layout,rsd_page_rows} = getUserSettings(context.req)
    // use url param if present else user settings
    const page_rows = rows ?? rsd_page_rows

    // get news items list to all pages server side
    const {count,news} = await getNewsList({
      // api uses 0 based index
      page: page>0 ? page-1 : 0,
      rows: page_rows,
      is_published: token ? false : true,
      searchFor: search,
      token
    })

    return {
      // passed to the page component as props
      props: {
        search,
        count,
        page,
        rows: page_rows,
        layout: rsd_page_layout,
        news,
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
