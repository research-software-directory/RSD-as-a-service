// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import OutputByType from './OutputByType'
import FindOutput from './FindOutput'
import AddOutput from './AddOutput'
import EditOutputProvider from './EditOutputProvider'
import useProjectContext from '../useProjectContext'
import ImportProjectOutput from './ImportProjectOutput'

export default function ProjectOutput() {
  const {token} = useSession()
  const {project} = useProjectContext()

  // console.group('ProjectOutput')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditOutputProvider token={token} project={project.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:gap-[3rem]'>
        <div className="pt-4 pb-8">
          <OutputByType />
        </div>
        <div className="pt-4 pb-8">
          <FindOutput />
          <ImportProjectOutput/>
          <AddOutput />
        </div>
      </EditSection>
    </EditOutputProvider>
  )
}
