// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditImpactProvider from './EditImpactProvider'
import ImpactByType from './ImpactByType'
import FindImpact from './FindImpact'
import AddImpact from './AddImpact'
import useProjectContext from '../useProjectContext'
import BulkImport from '~/components/mention/BulkImport'

export default function ProjectImpact() {
  const {token} = useSession()
  const {project} = useProjectContext()

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditImpactProvider token={token} project={project.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="pt-4 pb-8 xl:pl-[3rem]">
          <ImpactByType />
        </div>
        <div className="pt-4 pb-8">
          <FindImpact />
          <div className="py-4"></div>
          <AddImpact />
          <div className="py-4"></div>
          <BulkImport table="impact_for_project" entityId={project.id!}></BulkImport>
        </div>
      </EditSection>
    </EditImpactProvider>
  )
}
