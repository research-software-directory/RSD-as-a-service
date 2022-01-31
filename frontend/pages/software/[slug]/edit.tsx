import {useState} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'

import {IconButton} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

import {app} from '../../../config/app'
import ProtectedContent from '../../../auth/ProtectedContent'
import PageSnackbar from '../../../components/snackbar/PageSnackbar'
import PageSnackbarContext, {snackbarDefaults} from '../../../components/snackbar/PageSnackbarContext'
import DefaultLayout from '../../../components/layout/DefaultLayout'
import PageTitle from '../../../components/layout/PageTitle'
import {editSoftwareMenu} from '../../../components/software/edit/editSoftwareSteps'
import logger from '../../../utils/logger'
import EditSoftwareNav from '../../../components/software/edit/EditSoftwareNav'

export default function SoftwareItemEdit() {
  const [options, setSnackbar] = useState(snackbarDefaults)
  const router = useRouter()
  const slug = router.query['slug']
  // default is first step in array
  const [step, setStep] = useState(editSoftwareMenu[0])

  return (
    <DefaultLayout>
        <Head>
          <title>Edit software | {app.title}</title>
        </Head>
        <ProtectedContent slug={slug?.toString()}>
          <PageSnackbarContext.Provider value={{options,setSnackbar}}>
          <section className="md:flex">
            <EditSoftwareNav
              step={step}
              setStep={setStep}
            />
            {/* Here we load main component of each step */}
            {step.component}
          </section>
          </PageSnackbarContext.Provider>
        <PageSnackbar options={options} setOptions={setSnackbar} />
      </ProtectedContent>
      </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps(context:GetServerSidePropsContext) {
//   try {
//   }catch(e:any){
//     logger(`SoftwareIndexPage.getServerSideProps: ${e.message}`,'error')
//     return {
//       notFound: true,
//     }
//   }
// }
