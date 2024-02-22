// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditSection from '~/components/layout/EditSection'
import FindSoftwareMention from '~/components/software/edit/mentions/FindSoftwareMention'
import MentionEditSection from '~/components/mention/MentionEditSection'
import ScrapersInfo from '~/components/projects/edit/mentions/output/ScrapersInfo'
import {findPublicationByTitle} from '../output/apiRelatedOutput'
import {cfgReferencePapers as config} from './config'
import EditReferencePapersProvider from './EditReferencePapersProvider'
import ReferencePapersInfo from './ReferencePapersInfo'

export default function ReferencePapersTab() {

  return (
    <EditReferencePapersProvider>
      <EditSection className="xl:grid xl:grid-cols-[3fr,2fr] xl:px-0 xl:gap-[3rem]">
        <div className="pt-4 pb-8">
          <ReferencePapersInfo />
          <div className="py-2" />
          <MentionEditSection />
        </div>
        <div className="pt-4 pb-8">
          {/* use mention component */}
          <FindSoftwareMention
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
