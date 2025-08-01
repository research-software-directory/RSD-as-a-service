// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import {getRsdModules} from '~/config/getSettingsServerSide'
import {useUserSettings} from '~/config/UserSettingsContext'
import {OrganisationForOverview} from '~/types/Organisation'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/utils/userSettings'
import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import PageBackground from '~/components/layout/PageBackground'
import MainContent from '~/components/layout/MainContent'
import PaginationLink from '~/components/layout/PaginationLink'
import useSearchParams from '~/components/search/useSearchParams'
import SearchInput from '~/components/search/SearchInput'
import OrganisationGrid from '~/components/organisation/overview/OrganisationGrid'
import ViewToggleGroup from '~/components/projects/overview/search/ViewToggleGroup'
import SelectRows from '~/components/software/overview/search/SelectRows'
import {getOrganisationsList} from '~/components/organisation/apiOrganisations'
import OrganisationListView from '~/components/organisation/overview/OrganisationList'

type OrganisationsOverviewPageProps = {
  count: number,
  page: number,
  rows: number,
  organisations: OrganisationForOverview[],
  search?: string,
}

const pageTitle = `Organisations | ${app.title}`
const pageDesc = 'List of organizations involved in the development of research software.'

export default function OrganisationsOverviewPage({
  organisations = [], count, page, rows, search
}: OrganisationsOverviewPageProps) {
  const {handleQueryChange,createUrl} = useSearchParams('organisations')
  const numPages = Math.ceil(count / rows)
  const {rsd_page_layout,setPageLayout} = useUserSettings()
  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  // console.group('OrganisationsOverviewPage')
  // console.log('search...', search)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('view...', view)
  // console.log('organisations...', organisations)
  // console.groupEnd()

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={pageTitle}
        description={pageDesc}
      />
      {/* canonical url meta tag */}
      <CanonicalUrl />

      <PageBackground>
        <AppHeader />

        <MainContent className="py-4">
          {/* Page title with search and pagination */}
          <div className="flex flex-wrap py-8 px-4 rounded-lg bg-base-100 lg:sticky top-0 border border-base-200 z-11">
            <h1 className="mr-4 lg:flex-1">
              Organisations
            </h1>
            <div className="flex-2 flex min-w-[20rem]">
              <SearchInput
                placeholder="Search organisation by name, ROR name or website"
                onSearch={(search: string) => handleQueryChange('search', search)}
                defaultValue={search ?? ''}
              />
              <ViewToggleGroup
                layout={view}
                onSetView={setPageLayout}
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
          {/* Organizations cards */}
          {view === 'list' ?
            <OrganisationListView organisations={organisations}/>
            :
            <OrganisationGrid organisations={organisations}/>
          }
          {/* Pagination */}
          <PaginationLink
            count={numPages}
            page={page}
            createUrl={createUrl}
            className="mb-10"
          />
        </MainContent>

        {/* App footer */}
        <AppFooter />
      </PageBackground >
    </>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const {req} = context
  const {search, rows, page} = ssrBasicParams(context.query)
  const token = req?.cookies['rsd_token']
  const modules = await getRsdModules()
  // show 404 page if module is not enabled
  if (modules?.includes('organisations')===false){
    return {
      notFound: true,
    }
  }
  // extract user settings from cookie
  const {rsd_page_rows} = getUserSettings(context.req)
  // use url param if present else user settings
  const page_rows = rows ?? rsd_page_rows

  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('page_rows...', page_rows)

  const {count, data} = await getOrganisationsList({
    search,
    rows: page_rows,
    // api uses 0 based index
    page: page>0 ? page-1 : 0,
    token,
  })

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      search,
      count,
      page,
      rows: page_rows,
      organisations: data
    }
  }
}
