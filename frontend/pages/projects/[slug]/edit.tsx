import {useRouter} from 'next/router'
import Head from 'next/head'

import {IconButton} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'

import DefaultLayout from '../../../components/layout/DefaultLayout'
import PageTitle from '../../../components/layout/PageTitle'


export default function ProjectItemEdit() {
  const router = useRouter()
  const slug = router.query['slug']
  return (
    <DefaultLayout>
      <Head>
        <title>Project | RSD</title>
      </Head>
      <PageTitle title={`Edit ${slug}`}>
        <IconButton
          title="Go back"
          onClick={()=>router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton
          title="Save"
          onClick={()=>router.replace(`/projects/${slug}`)}>
          <SaveIcon />
        </IconButton>
      </PageTitle>
    </DefaultLayout>
  )
}
