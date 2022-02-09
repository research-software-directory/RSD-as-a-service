import {useReducer} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'

import {app} from '../../../config/app'
import {useAuth} from '../../../auth'
import ProtectedContent from '../../../auth/ProtectedContent'
import DefaultLayout from '../../../components/layout/DefaultLayout'
import {editSoftwareMenu, EditSoftwarePageStep} from '../../../components/software/edit/editSoftwareSteps'
import EditSoftwareNav from '../../../components/software/edit/EditSoftwareNav'
import EditSoftwareContext,{EditSoftwareActionType} from '../../../components/software/edit/editSoftwareContext'
import ContentLoader from '../../../components/layout/ContentLoader'
import {editSoftwareReducer} from '../../../components/software/edit/editSoftwareContext'
import EditSoftwareStickyHeader from '../../../components/software/edit/EditSoftwareStickyHeader'

export default function EditSoftwareItem() {
  const {session} = useAuth()
  const {token} = session
  const router = useRouter()
  const slug = router.query['slug']
  const [pageState, dispatchPageState] = useReducer(editSoftwareReducer,{
    // default step is first step
    step: editSoftwareMenu[0],
    // current form state is shared to warn for unsaved changes
    isDirty: false,
    isValid: false
  })

  function onChangeStep({nextStep}:{nextStep:EditSoftwarePageStep}) {
    // changes made but not saved or cancelled
    if (pageState?.isDirty===true) {
      // notify user about unsaved changes
      const leavePage = confirm(app.unsavedChangesMessage)
      // if user is OK to leave section without saving
      if (leavePage === true) {
        // change to next step
        dispatchPageState({
          type: EditSoftwareActionType.SET_EDIT_STEP,
          payload: nextStep
        })
      }
      // else we do not change step/section
    } else {
      dispatchPageState({
        type: EditSoftwareActionType.SET_EDIT_STEP,
        payload: nextStep
      })
    }
  }

  function renderStepComponent() {
    if (pageState.step) {
      return pageState.step.component({slug,token})
    }
    return <ContentLoader />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Edit software | {app.title}</title>
      </Head>
      <ProtectedContent slug={slug?.toString()}>
        <EditSoftwareContext.Provider value={{pageState, dispatchPageState}}>
          <EditSoftwareStickyHeader />
          <section className="md:flex">
            <EditSoftwareNav
              onChangeStep={onChangeStep}
            />
            {/* Here we load main component of each step */}
            {renderStepComponent()}
          </section>
        </EditSoftwareContext.Provider>
      </ProtectedContent>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps(context:GetServerSidePropsContext) {
//   try {
//     const {req,params} = context
//     const rsd_token = req?.cookies['rsd_token']
//     // if we have token and slug we can load software table server side
//     if (rsd_token && params?.slug) {
//       const resp = await getSoftwareToEdit({
//         slug: params?.slug.toString(),
//         token: rsd_token,
//         // we need baseUrl when calling fn from node
//         baseUrl:process.env.POSTGREST_URL
//       })
//       // provide software data to component
//       return {
//         props: {
//           software:resp
//         }
//       }
//     } else {
//       // return 404 page for now
//       return {
//         notFound: true,
//       }
//     }
//   }catch(e:any){
//     logger(`SoftwareIndexPage.getServerSideProps: ${e.message}`,'error')
//     return {
//       notFound: true,
//     }
//   }
// }
