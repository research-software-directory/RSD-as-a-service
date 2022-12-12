// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedContent from '~/auth/ProtectedContent'
import ContentLoader from '~/components/layout/ContentLoader'
import EditProjectNav from './EditProjectNav'
import EditProjectStickyHeader from './EditProjectStickyHeader'
import useProjectContext from './useProjectContext'

export default function EditProjectPage({slug}:{slug:string}) {
  const {step} = useProjectContext()

  function renderStepComponent() {
    if (step) {
      return step.component({slug})
    }
    return <ContentLoader />
  }

  // console.group('EditProjectPage')
  // console.log('slug...', slug)
  // console.log('step...', step)
  // console.groupEnd()

  return (
    <ProtectedContent
      // validates if user is maintainer of this project
      pageType='project'
      slug={slug}>
      <EditProjectStickyHeader />
      <section className="md:flex">
        <EditProjectNav />
        {/* Here we load main component of each step */}
        {renderStepComponent()}
      </section>
    </ProtectedContent>
  )
}
