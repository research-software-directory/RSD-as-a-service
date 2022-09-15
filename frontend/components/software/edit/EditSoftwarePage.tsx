// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ProtectedContent from '~/auth/ProtectedContent'
import ContentLoader from '~/components/layout/ContentLoader'
import EditSoftwareNav from './EditSoftwareNav'
import EditSoftwareStickyHeader from './EditSoftwareStickyHeader'
import useSoftwareContext from './useSoftwareContext'

export default function EditSoftwarePage({slug}: { slug: string }) {
  const {step} = useSoftwareContext()

  function renderStepComponent() {
    if (step) {
      return step.component({slug})
    }
    return <ContentLoader />
  }

  return (
    <ProtectedContent slug={slug?.toString()}>
      <EditSoftwareStickyHeader />
      <section className="md:flex">
        <EditSoftwareNav />
        {/* Here we load main component of each step */}
        {renderStepComponent()}
      </section>
    </ProtectedContent>
  )
}
