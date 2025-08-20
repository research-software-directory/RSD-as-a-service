// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import {useSession} from '~/auth/AuthProvider'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {useUserSettings} from '~/config/UserSettingsContext'
import {getUserSettings} from '~/utils/userSettings'
import {ssrBasicParams} from '~/utils/extractQueryParam'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import PageMeta from '~/components/seo/PageMeta'
import PageBackground from '~/components/layout/PageBackground'
import MainContent from '~/components/layout/MainContent'
import PaginationLink from '~/components/layout/PaginationLink'
import SearchInput from '~/components/search/SearchInput'
import useSearchParams from '~/components/search/useSearchParams'
import SelectRows from '~/components/software/overview/search/SelectRows'
import ViewToggleGroup from '~/components/projects/overview/search/ViewToggleGroup'
import CommunitiesList from '~/components/communities/overview/CommunitiesList'
import CommunitiesGrid from '~/components/communities/overview/CommunitiesGrid'
import {CommunityListProps, getCommunityList} from '~/components/communities/apiCommunities'

const pageTitle = `Communities | ${app.title}`
const pageDesc = 'List of RSD communities.'

type CommunitiesOverviewProps={
  count: number,
  page: number,
  rows: number,
  search?: string,
  communities: CommunityListProps[]
}

export default function CommunitiesOverview({count,page,rows,search,communities}:CommunitiesOverviewProps) {
  const {user} = useSession()
  if (user?.role !== 'rsd_admin') {
    for (const community of communities) {
      community.pending_cnt = null
    }
  }
  const {handleQueryChange,createUrl} = useSearchParams('communities')
  // const [view, setView] = useState<ProjectLayoutType>(initView)
  const numPages = Math.ceil(count / rows)
  const {rsd_page_layout,setPageLayout} = useUserSettings()
  // if masonry we change to grid
  const view = rsd_page_layout === 'masonry' ? 'grid' : rsd_page_layout

  // console.group('CommunitiesOverview')
  // console.log('count...', count)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('view...', view)
  // console.log('search...', search)
  // console.log('communities...', communities)
  // console.groupEnd()

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
              Communities
            </h1>
            <div className="flex-2 flex min-w-[20rem]">
              <SearchInput
                placeholder="Search community by name or short description"
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

          {/* news cards, grid is default */}
          {view === 'list' ?
            <CommunitiesList items={communities} />
            :
            <CommunitiesGrid items={communities} />
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

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {req} = context
    const {search, rows, page} = ssrBasicParams(context.query)
    const token = req?.cookies['rsd_token']
    const modules = await getActiveModuleNames()
    // show 404 page if communities OR software module is not enabled
    // NOTE! communities are currently only for software
    if (modules?.includes('communities')===false || modules?.includes('software')===false){
      return {
        notFound: true,
      }
    }
    // extract user settings from cookie
    const {rsd_page_rows} = getUserSettings(context.req)
    // use url param if present else user settings
    const page_rows = rows ?? rsd_page_rows

    // get news items list to all pages server side
    const {count,communities} = await getCommunityList({
      // api uses 0 based index
      page: page>0 ? page-1 : 0,
      rows: page_rows,
      searchFor: search,
      orderBy: 'software_cnt.desc.nullslast,name.asc',
      token
    })

    return {
      // passed to the page component as props
      props: {
        search,
        count,
        page,
        rows: page_rows,
        communities,
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
