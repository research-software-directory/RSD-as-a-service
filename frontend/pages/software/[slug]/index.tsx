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
        <title>{software?.brandName} | RSD</title>
      </Head>
      <PageTitle title={software?.brandName}>
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
      <pre>
        {JSON.stringify(software,null,2)}
      </pre>
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
  if (!software){
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
      software,
      slug: params?.slug
    },
  }
}catch(e){
  return {
    notFound: true,
  }
}}