import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'
import {useRouter} from 'next/router'
import TablePagination from '@mui/material/TablePagination'

import {app} from '../../config/app'
import DefaultLayout from '../../components/layout/DefaultLayout'
import PageTitle from '../../components/layout/PageTitle'
import Searchbox from '../../components/form/Searchbox'
import {ssrOrganisationUrl} from '../../utils/postgrestUrl'
import {OrganisationForOverview} from '../../types/Organisation'
import {rowsPerPageOptions} from '../../config/pagination'
import {ssrOrganisationParams} from '../../utils/extractQueryParam'
import {getOrganisationsList} from '../../utils/getOrganisations'
import OrganisationsGrid from '../../components/organisation/OrganisationGrid'

export default function OrganisationsIndexPage({count,page,rows,organisations=[]}:
  {count:number,page:number,rows:number,organisations:OrganisationForOverview[]
}) {
  // use next router (hook is only for browser)
  const router = useRouter()

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    const url = ssrOrganisationUrl({
      query: router.query,
      page: newPage
    })
    router.push(url)
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    const url = ssrOrganisationUrl({
      query: router.query,
      // reset to first page
      page: 0,
      rows: parseInt(event.target.value),
    })
    router.push(url)
  }

  function handleSearch(searchFor:string){
    const url = ssrOrganisationUrl({
      query: router.query,
      search: searchFor,
      // start from first page
      page: 0
    })
    router.push(url)
  }

  return (
     <DefaultLayout>
      <Head>
        <title>Organisations | {app.title}</title>
      </Head>
      <PageTitle title="Organisations">
        <div className="flex flex-wrap justify-end">
          <div className="flex items-center">
            <Searchbox
              placeholder='Search for organisation'
              onSearch={handleSearch}
            />
          </div>
          <TablePagination
            component="nav"
            count={count}
            page={page}
            labelRowsPerPage="Per page"
            onPageChange={handlePageChange}
            rowsPerPage={rows}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleItemsPerPage}
          />
        </div>
      </PageTitle>
      <OrganisationsGrid
        organisations={organisations}
      />
    </DefaultLayout>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // extract params from page-query
  // extract rsd_token
  const {req} = context
  const {search, rows, page} = ssrOrganisationParams(context)
  const token = req?.cookies['rsd_token']

  const {count, data} = await getOrganisationsList({
    search,
    rows,
    page,
    token
  })

  // will be passed as props to page
  // see params of SoftwareIndexPage function
  return {
    props: {
      count,
      page,
      rows,
      organisations:data
    }
  }
}
