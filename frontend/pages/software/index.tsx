import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import Alert from '@mui/material/Alert'
import TablePagination from '@mui/material/TablePagination';

import DefaultLayout from "../../components/layout/DefaultLayout"
import ContentInTheMiddle from "../../components/layout/ContentInTheMiddle"
import PageTitle from '../../components/layout/PageTitle'
import CardGrid from '../../components/layout/CardGrid'
import {SoftwareItem} from '../../types/SoftwareItem'
import {getSoftwareList} from '../../utils/getSoftware'
import {extractQueryParam} from '../../utils/extractQueryParam'
import {rowsPerPageOptions} from '../../config/pagination'

function renderItems(software:SoftwareItem[]){
  if (software.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }
  return software.map(item=>{
    return(
      <div key={item.slug}>
        <Link href={`/software/${item.slug}/`}>
          <a>{item.brand_name}</a>
        </Link>
      </div>
    )
  })
}


export default function SoftwareIndexPage({count,page,rows,software=[]}:
  {count:number,page:number,rows:number,software:SoftwareItem[]
}){

  // const rowsPerPageOptions = rowsPerPageOptions
  const router = useRouter()

  function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    // debugger
    router.push(`/software?page=${newPage}&rows=${rows}`)
  };

  function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    router.push(`/software?page=0&rows=${parseInt(event.target.value)}`)
  };

  return (
    <DefaultLayout>
      <Head>
        <title>Software | RSD</title>
      </Head>
      <PageTitle title="Software">
        <noscript>
          <Alert severity="warning">
            Limited functionality: Your browser does not support JavaScript.
          </Alert>
        </noscript>
        <TablePagination
          component="nav"
          count={count}
          page={page}
          labelRowsPerPage="Per page"
          onPageChange={handleChangePage}
          rowsPerPage={rows}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PageTitle>
      <CardGrid>
        {renderItems(software)}
      </CardGrid>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  // extract from page-query
  const rows = extractQueryParam({
    req: context,
    param: "rows",
    defaultValue: 12,
    castToType:"number"
  })
  const page = extractQueryParam({
    req: context,
    param: "page",
    defaultValue: 0,
    castToType:"number"
  })
  // console.log("getServerSideProps.page...", page)
  // console.log("getServerSideProps.rows...", rows)
  // console.log("getServerSideProps.offset...", rows * page)
  // console.log("getServerSideProps.query...",context.query);
  const software = await getSoftwareList({
    limit: rows,
    offset: rows * page,
    //baseUrl within docker network
    baseUrl: process.env.POSTGREST_URL
  })

  return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
    props: {
      count: software.count,
      page,
      rows,
      software: software.data
    },
  }
}