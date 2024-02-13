// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import EditSection from '~/components/layout/EditSection'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import FindProjectMention from '~/components/projects/edit/mentions/FindProjectMention'
import EditImpactProvider from './EditImpactProvider'
import ImpactByType from './ImpactByType'
import AddImpact from './AddImpact'
import BulkImportImpact from './ImportProjectImpact'
import {cfgImpact as config} from './config'
import {findPublicationByTitle} from './impactForProjectApi'

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
          <FindProjectMention
            config={{
              title: config.findMention.title,
              minLength: config.findMention.validation.minLength,
              label: config.findMention.label,
              help: config.findMention.help
            }}
            findPublicationByTitle={findPublicationByTitle}
          />
          <BulkImportImpact/>
          <AddImpact />
        </div>
      </EditSection>
    </EditImpactProvider>
  )
}
