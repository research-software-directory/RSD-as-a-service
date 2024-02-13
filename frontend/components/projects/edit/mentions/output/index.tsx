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
import OutputByType from './OutputByType'
import AddOutput from './AddOutput'
import EditOutputProvider from './EditOutputProvider'
import ImportProjectOutput from './ImportProjectOutput'
import ScrapersInfo from './ScrapersInfo'
import {cfgOutput as config} from './config'
import {findPublicationByTitle} from './outputForProjectApi'

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
          <FindProjectMention
            config={{
              title: config.findMention.title,
              minLength: config.findMention.validation.minLength,
              label: config.findMention.label,
              help: config.findMention.help
            }}
            findPublicationByTitle={findPublicationByTitle}
          />
          <ImportProjectOutput/>
          <AddOutput />
          <ScrapersInfo />
        </div>
      </EditSection>
    </EditOutputProvider>
  )
}
