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
import useSoftwareContext from '~/components/software/edit/context/useSoftwareContext'
import EditRelatedOutputProvider from './EditRelatedOutputProvider'
import AddRelatedOutput from './AddRelatedOutput'
import ImportRelatedOutput from './ImportRelatedOutput'
import {cfgMention as config} from './config'
import {findPublicationByTitle} from './apiRelatedOutput'
import RelatedOutputInfo from './RelatedOutputInfo'

export default function SoftwareOutputTab() {
  const {software} = useSoftwareContext()
  return (
    <EditRelatedOutputProvider>
      <EditSection className="xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
        <div className="pt-4 pb-8">
          <RelatedOutputInfo />
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
          <ImportRelatedOutput/>
          <AddRelatedOutput />
        </div>
      </EditSection>
    </EditRelatedOutputProvider>
  )
}
