// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import {useRouter} from 'next/router'
import {GetServerSidePropsContext} from 'next/types'
import TablePagination from '@mui/material/TablePagination'
import Pagination from '@mui/material/Pagination'
import useMediaQuery from '@mui/material/useMediaQuery'

import {app} from '../../config/app'
import DefaultLayout from '../../components/layout/DefaultLayout'
import PageTitle from '../../components/layout/PageTitle'
import {SoftwareListItem} from '../../types/SoftwareTypes'
import {rowsPerPageOptions} from '../../config/pagination'
import {getSoftwareList} from '../../utils/getSoftware'
import {ssrSoftwareParams} from '../../utils/extractQueryParam'
import {highlightsListUrl, ssrSoftwareUrl} from '../../utils/postgrestUrl'
import LatestHighlight from '~/components/highlights/LatestHighlight'
import useRsdSettings from '~/config/useRsdSettings'
import {defaultHighlightsSettings} from '~/config/rsdSettingsReducer'
import {getParticipatingOrganisations} from '~/utils/editOrganisation'
import {ParticipatingOrganisationProps} from '~/types/Organisation'
import HighlightsGrid from '~/components/highlights/HighlightsGrid'

type SoftwareHighlightsIndexPageProps = {
  count: number,
  page: number,
  rows: number,
  keywords?: string[],
  software: SoftwareListItem[],
  search?: string,
  organisations?: ParticipatingOrganisationProps[]
}

export default function SoftwareHighlightsIndexPage(
  {software=[], count, page, rows, organisations}: SoftwareHighlightsIndexPageProps
) {
  const {host} = useRsdSettings()
  const highlightsSettings = host.highlights || defaultHighlightsSettings
  const pageTitle = `${highlightsSettings.titlePlural}`
  const tabTitle = `${pageTitle} | ${app.title}`
  // use next router (hook is only for browser)
  const router = useRouter()
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery('(max-width:600px)')
  // adjust grid min width for mobile to 18rem
  const minWidth = smallScreen ? '18rem' : '26rem'

  // next/previous page button
  function handleTablePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) {
    const url = ssrSoftwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      page: newPage,
    })
    router.push(url)
  }

  function handlePaginationChange(
    event: ChangeEvent<unknown>,
    newPage: number,
  ) {
    // Pagination component starts counting from 1, but we need to start from 0
    handleTablePageChange(event as any, newPage - 1)
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    const url = ssrSoftwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
    router.push(url)
  }

  function handleSearch(searchFor: string) {
    // debugger
    const url = ssrSoftwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      search: searchFor,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  function handleFilters(keywords: string[]){
    const url = ssrSoftwareUrl({
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      keywords,
      // start from first page
      page: 0,
    })
    router.push(url)
  }

  // TODO! handle sort options
  // function handleSort(sortOn:string){
  //   logger(`software.index.handleSort: TODO! Sort on...${sortOn}`,'warn')
  // }

  return (
    <DefaultLayout>
      <Head>
        <title>{tabTitle}</title>
      </Head>
      <PageTitle title={pageTitle}>
        <div className="md:flex flex-wrap justify-end">
          <TablePagination
            component="nav"
            count={count}
            page={page}
            labelRowsPerPage="Per page"
            onPageChange={handleTablePageChange}
            rowsPerPage={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleItemsPerPage}
          />
        </div>
        <div className=''>
          Software Highlights are the outstanding software products in the RSD.
        </div>
      </PageTitle>

      <LatestHighlight
        highlightsProps={highlightsSettings}
        softwareData={software[0]}
        organisations={organisations}
      />

      <h3 className='pt-6 pb-4'>Previously featured software highlights</h3>

      <HighlightsGrid
        className='gap-[0.125rem] p-[0.125rem] pt-4 pb-12'
        grid={{
          height: '28rem',
          minWidth,
          maxWidth:'1fr'
        }}
        software={software.slice(1)}
      />

      <div className="flex flex-wrap justify-center mb-5">
        <Pagination
          count={Math.ceil(count/rows)}
          page={page + 1}
          onChange={handlePaginationChange}
          size="large"
          shape="rounded"
        />
      </div>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  // extract params from page-query
  const {search, keywords, rows, page} = ssrSoftwareParams(context.query)
  // construct postgREST api url with query params
  const url = highlightsListUrl({
    baseUrl: process.env.POSTGREST_URL || 'http://localhost:3500',
    search,
    keywords,
    order: 'updated_at',
    limit: rows,
    offset: rows * page,
  })

  // get software list, we do not pass the token
  // when token is passed it will return not published items too
  const software = await getSoftwareList({url})

  const latestHighlight = software.data[0]

  // get organisation info for latest highlight
  const organisations = await getParticipatingOrganisations({software:latestHighlight.id,frontend:false})

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      search,
      keywords,
      count: software.count,
      page,
      rows,
      software: software.data,
      organisations: organisations
    },
  }
}
