import {useState, useEffect, MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import Link from 'next/link'

import Alert from '@mui/material/Alert'
import TablePagination from '@mui/material/TablePagination';

import DefaultLayout from "../../components/layout/DefaultLayout"
import ContentInTheMiddle from "../../components/layout/ContentInTheMiddle"
import PageTitle from '../../components/layout/PageTitle'
import CardGrid from '../../components/layout/CardGrid'
import {ProjectItem} from '../../types/ProjectItem'
import {getProjects} from '../../utils/getProjects'

export default function ProjectsIndexPage({projects}:{projects:ProjectItem[]}) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(12)
  const [projectList, setProjectList] = useState(projects)
  const rowsPerPageOptions = [12,24,48]

  useEffect(()=>{
    // debugger
    getProjects({
      limit:rowsPerPage,
      offset: rowsPerPage * page
    }).then(data=>{
      setProjectList(data)
    })
  },[page,rowsPerPage])

  const handleChangePage = (
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  if (projectList.length===0){
    return (
      <ContentInTheMiddle>
        <h1>No content</h1>
      </ContentInTheMiddle>
    )
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Projects | RSD</title>
      </Head>
      <PageTitle title="Projects">
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
      <div>
        <Link href="/projects/752/">
            <a>View single project page</a>
        </Link>
      </div>
      </CardGrid>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  // console.log("AppContext...", context)
  const projects:ProjectItem[] = await getProjects({limit:12,offset:0})
  return {
    props: {
      // will be passed to the page component as props
      projects
    },
  }
}