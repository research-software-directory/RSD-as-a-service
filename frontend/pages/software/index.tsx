import {useState, useEffect, MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'

import Alert from '@mui/material/Alert'
import TablePagination from '@mui/material/TablePagination';

import DefaultLayout from "../../components/layout/DefaultLayout"
import PageTitle from '../../components/layout/PageTitle'
import CardGrid from '../../components/layout/CardGrid'
import SoftwareCard from '../../components/software/SoftwareCard'
import {SoftwareItem} from '../../types/SoftwareItem'
import {getSoftwareList} from '../../utils/getSoftware'

export default function SoftwareIndexPage({software=[]}:{software:SoftwareItem[]}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [softwareList, setSoftwareList] = useState(software)
  const rowsPerPageOptions = [12,24,48]

  useEffect(()=>{
    // debugger
    getSoftwareList({
      limit:rowsPerPage,
      offset: rowsPerPage * page
    }).then(data=>{
      setSoftwareList(data)
    })
  },[page,rowsPerPage])

  function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    setPage(newPage);
  };

  function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  // console.log("software...", software)

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
          count={100}
          page={page}
          labelRowsPerPage="Per page"
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </PageTitle>
      <CardGrid>
        {
          softwareList.map(item=>{
            return <SoftwareCard key={item.primaryKey.id} software={item} />
          })
        }
      </CardGrid>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  const software:SoftwareItem[] = await getSoftwareList({limit:12,offset:0})
  // console.log("getServerSideProps...software...", software)
  return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
    props: {
      software
    },
  }
}