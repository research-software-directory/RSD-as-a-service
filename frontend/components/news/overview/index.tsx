// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import useHandleQueryChange from '~/utils/useHandleQueryChange'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import {useUserSettings} from '~/config/UserSettingsContext'
import SearchInput from '~/components/search/SearchInput'
import ToggleViewGroup from '~/components/search/ToggleViewGroup'
import ShowItemsSelect from '~/components/search/ShowItemsSelect'
import {NewsListItemProps} from '~/components/news/apiNews'
import NewsList from './list'
import NewsGrid from './NewsGrid'

type NewsOverviewProps = Readonly<{
  page: number,
  pages: number,
  rows: number,
  news: NewsListItemProps[],
  search?: string|null,
}>

export default function NewsOverview({pages,page,rows,search,news}:NewsOverviewProps) {
  const {handleQueryChange} = useHandleQueryChange()
  const {rsd_page_layout,setPageLayout,setPageRows} = useUserSettings()

  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  return (
    <>
      <div className="flex flex-wrap mt-4 py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
        <h1 className="mr-4 lg:flex-1">
          News
        </h1>
        <div className="flex-2 flex min-w-[20rem]">
          <SearchInput
            placeholder="Search news items by title, summary or author"
            onSearch={(search: string) => handleQueryChange('search', search)}
            defaultValue={search ?? ''}
          />
          <ToggleViewGroup
            view={view}
            onChangeView={setPageLayout}
            sx={{
              marginLeft:'0.5rem'
            }}
          />
          <ShowItemsSelect
            items={rows}
            onItemsChange={(items)=>{
              setPageRows(items)
              handleQueryChange('rows', items.toString())
            }}
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
      <PaginationLinkApp
        count={pages}
        page={page}
      />
    </>
  )
}
