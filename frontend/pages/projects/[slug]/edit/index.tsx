import {useReducer} from 'react'
import {useRouter} from 'next/router'
import Head from 'next/head'

import {useForm, FormProvider} from 'react-hook-form'

import {app} from '../../../../config/app'
import {useAuth} from '../../../../auth'
import ProtectedContent from '../../../../auth/ProtectedContent'
import DefaultLayout from '../../../../components/layout/DefaultLayout'
import ContentLoader from '~/components/layout/ContentLoader'
import EditProjectContext,{initalState} from '~/components/projects/edit/editProjectContext'
import EditProjectStickyHeader from '~/components/projects/edit/EditProjectStickyHeader'
import {editProjectSteps} from '~/components/projects/edit/editProjectSteps'
import EditProjectNav from '~/components/projects/edit/EditProjectNav'
import {editProjectReducer} from '~/components/projects/edit/editProjectReducer'

export default function ProjectItemEdit() {
  const {session} = useAuth()
  const router = useRouter()
  const slug = router.query['slug']
  const methods = useForm({
    mode:'onChange'
  })
  const [state, dispatch] = useReducer(editProjectReducer, {
    ...initalState,
    // first step is default
    step: editProjectSteps[0]
  })

  function renderStepComponent() {
    if (state.step) {
      return state.step.component({slug,session})
    }
    return <ContentLoader />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>Edit project | {app.title}</title>
      </Head>
      <ProtectedContent
        // validates if user is maintainer of this project
        pageType='project'
        slug={slug?.toString()}>
        {/* edit project context is shares info between steps */}
        <EditProjectContext.Provider value={{state, dispatch}}>
        {/* form provider to share isValid, isDirty states in the header */}
        <FormProvider {...methods}>
          <EditProjectStickyHeader />
          <section className="md:flex">
            <EditProjectNav />
            {/* Here we load main component of each step */}
            {renderStepComponent()}
          </section>
        </FormProvider>
        </EditProjectContext.Provider>
      </ProtectedContent>
    </DefaultLayout>
  )
}
