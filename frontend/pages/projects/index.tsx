import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'

import Alert from '@mui/material/Alert'
import TablePagination from '@mui/material/TablePagination'

import DefaultLayout from '../../components/layout/DefaultLayout'
import ContentInTheMiddle from '../../components/layout/ContentInTheMiddle'
import PageTitle from '../../components/layout/PageTitle'
import CardGrid from '../../components/layout/CardGrid'
import {ProjectItem} from '../../types/ProjectItem'
import {getProjectList} from '../../utils/getProjects'
import {extractQueryParam} from '../../utils/extractQueryParam'
import {rowsPerPageOptions} from '../../config/pagination'

function renderItems(projects:ProjectItem[]){
  if (projects.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }
  return(
    <CardGrid>
      {projects.map(item=>{
        return (
          <div key={item.slug}>
            <Link href={`/projects/${item.slug}/`}>
              <a>{item.title}</a>
            </Link>
          </div>
        )
      })}
    </CardGrid>
  )
}

export default function ProjectsIndexPage({count,page,rows,projects=[]}:
  {count:number,page:number,rows:number,projects:ProjectItem[]
}) {
  const router = useRouter()

  function handleChangePage(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    router.push(`/projects?page=${newPage}&rows=${rows}`)
  }

  function handleChangeRowsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    router.push(`/projects?page=0&rows=${parseInt(event.target.value)}`)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Projects | RSD</title>
      </Head>
      <PageTitle title="Projects">
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
      { renderItems(projects) }
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  // extract from page-query
  const rows = extractQueryParam({
    req: context,
    param: 'rows',
    defaultValue: 12,
    castToType:'number'
  })
  const page = extractQueryParam({
    req: context,
    param: 'page',
    defaultValue: 0,
    castToType:'number'
  })
  // make api call
  const projects = await getProjectList({
    limit: rows,
    offset: rows * page,
    //baseUrl within docker network
    baseUrl: process.env.POSTGREST_URL
  })

  return {
    // pass this to page component as props
    props: {
      count: projects.count,
      page,
      rows,
      projects: projects.data
    },
  }
}
