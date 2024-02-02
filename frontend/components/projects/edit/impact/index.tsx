// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditImpactProvider from './EditImpactProvider'
import ImpactByType from './ImpactByType'
import FindImpact from './FindImpact'
import AddImpact from './AddImpact'
import useProjectContext from '../useProjectContext'
import BulkImportImpact from './ImportProjectImpact'

export default function ProjectImpact() {
  const {token} = useSession()
  const {project} = useProjectContext()

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditImpactProvider token={token} project={project.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:gap-[3rem]'>
        <div className="pt-4 pb-8">
          <ImpactByType />
        </div>
        <div className="pt-4 pb-8">
          <FindImpact />
          <BulkImportImpact/>
          <AddImpact />
        </div>
      </EditSection>
    </EditImpactProvider>
  )
}
