// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Session} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import EditImpactProvider from './EditImpactProvider'
import ImpactByType from './ImpactByType'
import FindImpact from './FindImpact'
import AddImpact from './AddImpact'
import useProjectContext from '../useProjectContext'
import EditMentionsInfo from '~/components/software/edit/mentions/EditMentionsInfo'

export default function ProjectImpact({session}:{session:Session}) {
  const {project} = useProjectContext()

  // console.group('ProjectImpact')
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <EditImpactProvider token={session.token} project={project.id}>
      <EditSection className='xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]'>
        <div className="pt-4 pb-8 xl:pl-[3rem]">
          <ImpactByType session={session}/>
        </div>
        <div className="pt-4 pb-8">
          <FindImpact />
          <div className="py-4"></div>
          <AddImpact />
          <div className="py-4"></div>
          <EditMentionsInfo
            title="Edit impact items"
          />
        </div>
      </EditSection>
    </EditImpactProvider>
  )
}
