import {MouseEvent, ChangeEvent} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {useRouter} from 'next/router'
import TablePagination from '@mui/material/TablePagination';

import DefaultLayout from "../../components/layout/DefaultLayout"
import ContentInTheMiddle from "../../components/layout/ContentInTheMiddle"
import PageTitle from '../../components/layout/PageTitle'
import CardGrid from '../../components/layout/CardGrid'
import {SoftwareItem} from '../../types/SoftwareItem'
import {getSoftwareList, getTagsWithCount, TagCountItem} from '../../utils/getSoftware'
import {extractQueryParam} from '../../utils/extractQueryParam'
import {rowsPerPageOptions} from '../../config/pagination'
import Searchbox from '../../components/software/Searchbox'
import FilterTechnologies from '../../components/software/FilterTechnologies'
import SortSelection from '../../components/software/SortSelection'
import SoftwareCard from '../../components/software/SoftwareCard'

export default function SoftwareIndexPage({count,page,rows,tags,software=[]}:
  {count:number,page:number,rows:number,tags:TagCountItem[],software:SoftwareItem[]
}){
  //use next router (hook is only for browser)
  const router = useRouter()

  // next/previous page button
  function handlePageChange(
    event: MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ){
    // debugger
    router.push(`/software?page=${newPage}&rows=${rows}`)
  }

  // change number of cards per page
  function handleItemsPerPage(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ){
    router.push(`/software?page=0&rows=${parseInt(event.target.value)}`)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Software | RSD</title>
      </Head>
      <PageTitle title="Software">
        <div className="flex flex-wrap sm:justify-end sm:px-4">
          <div className="flex items-center">
            <Searchbox onSearch={(searchFor:string)=>console.log("Search for...", searchFor)}></Searchbox>
            <FilterTechnologies
              items={tags.map(tag=>tag.tag)}
              onSelect={(resp)=>console.log("FilterTechnologies",resp)}
            />
            <SortSelection
              items={["Last updated", "Most updates", "Most mentions"]}
              defaultValue='Last updated'
              onSort={(resp)=>console.log("Sort on", resp)}
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
      <CardGrid>
        {renderItems(software)}
      </CardGrid>
    </DefaultLayout>
  )
}

// render software cards
function renderItems(software:SoftwareItem[]){
  if (software.length===0){
    return (
      <ContentInTheMiddle>
        <h2>No content</h2>
      </ContentInTheMiddle>
    )
  }
  // console.log("renderItems...software...", software)
  return software.map(item=>{
    return(
      <SoftwareCard
        key={`/software/${item.slug}/`}
        href={`/software/${item.slug}/`}
        brand_name={item.brand_name}
        short_statement={item.short_statement}
        is_featured={item.is_featured}
        updated_at={item.updated_at}
      />
    )
  })
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
    baseUrl: process.env.POSTGREST_URL || "http://localhost:3500"
  })

  const tags = await getTagsWithCount()

  return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
    props: {
      count: software.count,
      page,
      rows,
      software: software.data,
      tags
    },
  }
}