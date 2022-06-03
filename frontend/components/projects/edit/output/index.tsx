// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import OutputByType from './OutputByType'
import FindOutput from './FindOutput'
import AddOutput from './AddOutput'
import EditOutputProvider from './EditOutputProvider'
import useProjectContext from '../useProjectContext'

export default function ProjectOutput({session}: { session: Session }) {
  const {project} = useProjectContext()

  // console.group('ProjectOutput')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditOutputProvider token={session.token} project={project.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="py-4 xl:pl-[3rem]">
          <OutputByType session={session}/>
        </div>
        <div className="py-4 min-w-[21rem] xl:my-0">
          <FindOutput />
          <div className="py-4"></div>
          <AddOutput />
        </div>
      </EditSection>
    </EditOutputProvider>
  )
}
