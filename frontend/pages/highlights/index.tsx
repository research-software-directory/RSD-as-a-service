// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import {useRouter} from 'next/router'

import useMediaQuery from '@mui/material/useMediaQuery'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Pagination from '@mui/material/Pagination'
import Button from '@mui/material/Button'

import SoftwareFiltersPanel from '~/components/software/overview/SoftwareFiltersPanel'
import SearchInput from '~/components/software/overview/SearchInput'
import SoftwareHighlights from '~/components/software/highlights/SoftwareHighlights'
import OverviewPageBackground from '~/components/software/overview/PageBackground'
import SoftwareOverviewGrid from '~/components/software/overview/SoftwareOverviewGrid'
import MainContent from '~/components/layout/MainContent'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import SoftwareFilters from '~/components/software/overview/SoftwareFilters'
import useSoftwareOverview from '~/components/software/overview/useSoftwareOverview'

export default function SoftwareHighlightsPage() {
  const router = useRouter()
  const smallScreen = useMediaQuery('(max-width:640px)')
  const page = router.query.page ? parseInt(router.query.page as string) + 1 : 1
  const settings = useSoftwareOverview()
  const {
    keywords,
    software,
    search,
    orderBy,
    handleQueryChange,
    getFilterCount,
    resetFilters
  } = settings

  const [modal,setModal] = useState(false)
  const numPages = Math.ceil(software.count / 24)

  // console.group('SoftwareHighlightsPage')
  // console.log('page...', page)
  // console.log('numPages...', numPages)
  // console.log('smallScreen...', smallScreen)
  // console.groupEnd()

  return (
    <OverviewPageBackground>
      <AppHeader />
      {/* Software Highlights Carousel */}
      <SoftwareHighlights />
      {/* Main page body */}
      <MainContent className='pb-12'>
        {/* All software */}
        <h1 className="my-4 text-2xl">
          All software
        </h1>
        {/* Filter panel & content panel */}
        <div className="flex w-full my-4 gap-8">
          {/* Filters panel large screen */}
          {smallScreen===false &&
            <SoftwareFiltersPanel>
              <SoftwareFilters settings={settings} />
            </SoftwareFiltersPanel>
          }
          {/* Search & card grid section */}
          <div className="flex-1">
            <SearchInput
              placeholder={keywords?.length ? 'Find within selection' : 'Find software'}
              onSearch={(search: string) => handleQueryChange('search', search)}
              defaultValue={search}
            />
            {/* Filter button for mobile */}
            {smallScreen === true &&
              <Button
                onClick={() => setModal(true)}
                variant="outlined"
                sx={{
                  marginTop:'1rem'
                }}
              >
                Filters
              </Button>
            }
            <div className="text-sm opacity-70 py-4">
              {software.count} results.
              {/* Only show when filters are applied, and not just sorted */}
              {
                (orderBy !== '' && getFilterCount() > 1) || (orderBy === '' && getFilterCount() > 0) && <a onClick={() => { resetFilters() }} className="underline pl-2">Clear filters</a>
              }
            </div>
            {/* Software Cards Grid */}
            <SoftwareOverviewGrid
              software={software.items}
            />
            {/* Pagination */}
            <div className="flex justify-center mt-10">
              {numPages > 1 &&
                <Pagination
                  count={numPages}
                  page={page}
                  onChange={(_, page) => {
                    // api uses 0 index
                    const param = (page - 1).toString()
                    handleQueryChange('page',param)
                  }}
                />
              }
            </div>
          </div>
        </div>
      </MainContent>
      <AppFooter />
      {/* MODAL filter for mobile */}
      {
        smallScreen===true &&
        <Dialog
          fullScreen={smallScreen}
          open={modal}
          aria-labelledby="filters-panel"
          aria-describedby="filters-panel-responsive"
        >
          <DialogTitle sx={{
            fontSize: '1.5rem',
            borderBottom: '1px solid',
            borderColor: 'divider',
            color: 'primary.main',
            fontWeight: 500
          }}>
            Filters
          </DialogTitle>
          <DialogContent>
            <div className="flex p-8 shadow rounded-md flex-col gap-8">
              <SoftwareFilters settings={settings} />
            </div>
          </DialogContent>
          <DialogActions sx={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid',
            borderColor: 'divider'
          }}>
            <Button
              onClick={()=>setModal(false)}
              color="secondary"
              sx={{marginRight:'2rem'}}
            >
              Cancel
            </Button>
            <Button
              onClick={()=>setModal(false)}
              color="primary"
            >
              Apply
            </Button>
          </DialogActions>
        </Dialog>
      }
    </OverviewPageBackground>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps(context:GetServerSidePropsContext) {
//   // extract params from page-query
//   const {search, keywords, prog_lang, rows, page} = ssrSoftwareParams(context.query)
//   // construct postgREST api url with query params
//   const url = softwareListUrl({
//     baseUrl: process.env.POSTGREST_URL || 'http://localhost:3500',
//     search,
//     keywords,
//     prog_lang,
//     order: 'mention_cnt.desc.nullslast,contributor_cnt.desc.nullslast,updated_at.desc.nullslast',
//     limit: rows,
//     offset: rows * page,
//   })

//   // console.log('software...url...', url)

//   // get software list, we do not pass the token
//   // when token is passed it will return not published items too
//   const software = await getSoftwareList({url})

//   // will be passed as props to page
//   // see params of SoftwareIndexPage function
//   return {
//     props: {
//       search,
//       keywords,
//       prog_lang,
//       count: software.count,
//       page,
//       rows,
//       software: software.data,
//     },
//   }
// }
