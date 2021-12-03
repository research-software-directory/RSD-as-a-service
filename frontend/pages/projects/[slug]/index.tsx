import Head from 'next/head'
import {useRouter} from 'next/router'
import {useSession} from 'next-auth/react'

import DefaultLayout from "../../../components/layout/DefaultLayout"
import PageTitle from '../../../components/layout/PageTitle'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import {getProject} from '../../../utils/getProjects'
import {ProjectItem} from '../../../types/ProjectItem'

export default function ProjectItemPage({project, slug}:{project:ProjectItem, slug:string}) {
  const router = useRouter()
  const {status} = useSession()
  // console.log("useSession.status...", status)
  return (
    <DefaultLayout>
      <Head>
        <title>{project?.title} | RSD</title>
      </Head>
      <PageTitle title={project?.title}>
        <div>
          <IconButton
            title="Go back"
            onClick={()=>router.back()}>
            <ArrowBackIcon />
          </IconButton>
          <IconButton
            title="Edit"
            onClick={()=>router.push(`/projects/${slug}/edit`)}
            disabled={status!=='authenticated'}
          >
            <EditIcon />
          </IconButton>
        </div>
      </PageTitle>
      <pre>
        {JSON.stringify(project,null,2)}
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
  const project = await getProject(params?.slug)
  if (!project){
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
      project,
      slug: params?.slug
    },
  }
}catch(e){
  return {
    notFound: true,
  }
}}