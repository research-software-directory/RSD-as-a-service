// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useAuth} from '~/auth'
import {getMentionByDoi} from '~/utils/getDOI'
import {getMentionByDoiFromRsd} from '~/utils/editMentions'
import {MentionItemProps} from '~/types/Mention'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import FindMention from '~/components/mention/FindMention'
import FindMentionInfoPanel from '~/components/mention/FindMentionInfoPanel'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {extractSearchTerm} from '~/components/software/edit/mentions/utils'
import {findPublicationByTitle} from '~/components/software/edit/mentions/mentionForSoftwareApi'
import useSoftwareContext from '../useSoftwareContext'
import {cfgReferencePapers as config} from './config'

export default function FindReferencePaper() {
  const {software} = useSoftwareContext()
  const {session: {token}} = useAuth()
  const {onAdd} = useEditMentionReducer()

  async function findPublication(searchFor: string) {
    const searchData = extractSearchTerm(searchFor)
    if (searchData.type === 'doi') {
      searchFor = searchData.term
      // look first at RSD
      const rsd = await getMentionByDoiFromRsd({
        doi: searchFor,
        token
      })
      if (rsd?.status === 200 && rsd.message?.length === 1) {
        // return first found item in RSD
        const item:MentionItemProps = rsd.message[0]
        return [item]
      }
      // else find by DOI
      const resp = await getMentionByDoi(searchFor)
      if (resp?.status === 200) {
        return [resp.message as MentionItemProps]
      }
      return []
    } else{
      searchFor = searchData.term
      // find by title
      const mentions = await findPublicationByTitle({
        software: software.id ?? '',
        searchFor,
        token
      })
      return mentions
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.findMention.title}
        subtitle="Search"
      />
      {/* <h3 className="pt-4 pb-2 text-lg">Search</h3> */}
      <FindMentionInfoPanel>
        <div className="pt-4 overflow-hidden">
          <FindMention
            onAdd={onAdd}
            // do not use onCreate option,
            // use dedicated button instead
            // onCreate={onCreateImpact}
            searchFn={findPublication}
            config={{
              freeSolo: true,
              minLength: config.findMention.validation.minLength,
              label: config.findMention.label,
              help: config.findMention.help,
              reset: true
            }}
          />
        </div>
      </FindMentionInfoPanel>
    </>
  )
}
