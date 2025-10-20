// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import MentionEditSection from '~/components/mention/MentionEditSection'
import ScrapersInfo from '~/components/projects/edit/mentions/output/ScrapersInfo'
import FindMentionSection from '~/components/mention/FindMentionSection'
import {findPublicationByTitle} from '~/components/software/edit/mentions/output/apiRelatedOutput'
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import {cfgReferencePapers as config} from './config'
import EditReferencePapersProvider from './EditReferencePapersProvider'
import ReferencePapersInfo from './ReferencePapersInfo'

export default function ReferencePapersTab() {
  const {software} = useSoftwareContext()
  return (
    <EditReferencePapersProvider>
      <EditSection className="xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
        <div className="pt-4 pb-8">
          <ReferencePapersInfo />
          <div className="py-2" />
          <MentionEditSection />
        </div>
        <div className="pt-4 pb-8">
          <FindMentionSection
            id={software.id}
            config={{
              title: config.findMention.title,
              minLength: config.findMention.validation.minLength,
              label: config.findMention.label,
              help: config.findMention.help
            }}
            findPublicationByTitle={findPublicationByTitle}
          />
          <ScrapersInfo />
        </div>
      </EditSection>
    </EditReferencePapersProvider>
  )
}
