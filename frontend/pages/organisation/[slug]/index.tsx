import Head from 'next/head'
import {useRouter} from 'next/router'

import DefaultLayout from '../../../components/layout/DefaultLayout'
import PageTitle from '../../../components/layout/PageTitle'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {useAuth} from '../../../auth'

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
    // console.log('getServerSideProps...params...', params)
    return {
      // passed to the page component as props
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
