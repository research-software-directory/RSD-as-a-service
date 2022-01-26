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
import ProtectedContent from '../../../components/layout/ProtectedContent'
import PageSnackbar from '../../../components/snackbar/PageSnackbar'
import PageSnackbarContext, {snackbarDefaults} from '../../../components/snackbar/PageSnackbarContext'
import DefaultLayout from '../../../components/layout/DefaultLayout'
import PageTitle from '../../../components/layout/PageTitle'
import {editSoftwareMenu} from '../../../components/software/edit/editSoftwareSteps'
import logger from '../../../utils/logger'

export default function SoftwareItemEdit() {
  const [options, setSnackbar] = useState(snackbarDefaults)
  const router = useRouter()
  const slug = router.query['slug']
  // default is first step in array
  const [step, setStep] = useState(editSoftwareMenu[0])

  return (
    <ProtectedContent>
      <DefaultLayout>
        <Head>
          <title>Edit software | {app.title}</title>
        </Head>
        <PageSnackbarContext.Provider value={{options,setSnackbar}}>
          <PageTitle title={'Edit software'}>
            <nav className="w-full md:w-auto">
              <IconButton
                title="Go back"
                onClick={()=>router.back()}>
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                title="Save"
                onClick={() => {
                  // router.replace(`/software/${slug}`)
                  console.log('TODO! Save software item')
                }}>
                <SaveIcon />
              </IconButton>
            </nav>
          </PageTitle>
          <section className="md:flex">
            <nav>
              <List sx={{
                width:['100%','100%','15rem'],
                // border: '1px solid #ccc'
              }}>
                {editSoftwareMenu.map((item, pos) => {
                  return (
                    <ListItemButton
                      key={`step-${pos}`}
                      selected={item.label===step.label}
                      onClick={()=>setStep(editSoftwareMenu[pos])}
                    >
                      <ListItemIcon>
                          {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} secondary={item.status} />
                    </ListItemButton>
                  )
                })}
              </List>
            </nav>
            {/* Here we load step component */}
            {step.component}
          </section>
        </PageSnackbarContext.Provider>
        <PageSnackbar options={options} setOptions={setSnackbar} />
      </DefaultLayout>
    </ProtectedContent>
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
