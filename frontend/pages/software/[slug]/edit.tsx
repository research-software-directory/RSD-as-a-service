// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

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
  const pageTitle = `Edit software | ${app.title}`

  // console.group('EditSoftwareItem')
  // console.log('slug...', slug)
  // console.log('pageState...', pageState)
  // console.groupEnd()

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
      return pageState.step.component({slug,token,session})
    }
    return <ContentLoader />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
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
