import Head from 'next/head'
import {useRouter} from 'next/router'

import DefaultLayout from '../../../components/layout/DefaultLayout'
import PageTitle from '../../../components/layout/PageTitle'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {useAuth} from '../../../auth'

import {getProjectItem} from '../../../utils/getProjects'
import {ProjectItem} from '../../../types/ProjectItem'

export default function OrganisationPage({organisation, slug}:{organisation:any, slug:string}) {
  const router = useRouter()
  const {session: {status}} = useAuth()
  // console.log("useSession.status...", status)
  return (
    <DefaultLayout>
      <Head>
        <title>Organisation | RSD</title>
      </Head>
      <PageTitle title="Under construction">
        <div>
          <IconButton
            title="Go back"
            onClick={()=>router.back()}>
            <ArrowBackIcon />
          </IconButton>
          {/* <IconButton
            title="Edit"
            onClick={()=>router.push(`/projects/${slug}/edit`)}
            disabled={status!=='authenticated'}
          >
            <EditIcon />
          </IconButton> */}
        </div>
      </PageTitle>
      <h2 className='my-4'>
        Slug: {slug}
      </h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quo corporis nostrum eum beatae aperiam hic dolorem ipsum laborum mollitia.
      </p>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:any) {
  try{
    const {params} = context
    console.log('getServerSideProps...params...', params)

    return {
    // will be passed to the page component as props
    // see params in SoftwareIndexPage
      props: {
        organisation: null,
        slug: params?.slug
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }}
