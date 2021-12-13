import Head from 'next/head'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/react'

import DefaultLayout from "../../../components/layout/DefaultLayout"
import PageTitle from '../../../components/layout/PageTitle'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { getSoftwareItem } from '../../../utils/getSoftware'
import { SoftwareItem } from '../../../types/SoftwareItem'

export default function SoftwareIndexPage({software, slug}:{software:SoftwareItem, slug:string}) {
  const router = useRouter()
  const {status} = useSession()
  // console.log("useSession.status...", status)
  return (
    <DefaultLayout>
      <Head>
        <title>{software?.brand_name} | RSD</title>
      </Head>
      <PageTitle title={software?.brand_name}>
        <div>
          <IconButton
            title="Go back"
            onClick={()=>router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            title="Edit"
            onClick={()=>router.push(`/software/${slug}/edit`)}
            disabled={status!=='authenticated'}
          >
            <EditIcon />
          </IconButton>
        </div>
      </PageTitle>
      <section>
        {/* TODO! replace this with real components */}
        <h2 className="my-4">{software.short_statement}</h2>
        <ul>
          { software.bullets.split("*").map((item, pos)=>{
            if (pos===0) return null
            return (
              <li key={item}>{item}</li>
            )
          })}
        </ul>
      </section>
      {/* <pre>
        {JSON.stringify(software,null,2)}
      </pre> */}
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
try{
  const {params} = context
  // console.log("getServerSideProps...params...", params)
  const software = await getSoftwareItem(params?.slug)
  if (typeof software == "undefined" ||
    software?.length === 0){
    // returning this value
    // triggers 404 page on frontend
    return {
      notFound: true,
    }
  }
  return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
    props: {
      software: software[0],
      slug: params?.slug
    },
  }
}catch(e){
  return {
    notFound: true,
  }
}}