// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import MentionEditSection from '~/components/mention/MentionEditSection'
import FindMentionSection from '~/components/mention/FindMentionSection'
import useProjectContext from '~/components/projects/edit/context/useProjectContext'
import AddOutput from './AddOutput'
import EditOutputProvider from './EditOutputProvider'
import ImportProjectOutput from './ImportProjectOutput'
import ScrapersInfo from './ScrapersInfo'
import {cfgOutput as config} from './config'
import {findPublicationByTitle} from './outputForProjectApi'
import ProjectOutputInfo from './ProjectOutputInfo'

export default function ProjectOutputTab() {
  const {project} = useProjectContext()
  return (
    <EditOutputProvider>
      <EditSection className='xl:grid xl:grid-cols-[3fr_2fr] xl:gap-[3rem]'>
        <div className="pt-4 pb-8">
          <ProjectOutputInfo />
          <div className="py-2" />
          <MentionEditSection />
        </div>
        <div className="pt-4 pb-8">
          <FindMentionSection
            id={project.id}
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
