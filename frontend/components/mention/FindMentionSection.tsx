// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth/AuthProvider'
import {MentionItemProps} from '~/types/Mention'
import {getMentionByDoiFromRsd, getMentionByOpenalexIdFromRsd} from '~/components/mention/apiEditMentions'
import {getMentionByDoi} from '~/utils/getDOI'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import FindMention from '~/components/mention/FindMention'
import FindMentionInfoPanel from '~/components/mention/FindMentionInfoPanel'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {extractSearchTerm} from '~/components/software/edit/mentions/utils'
import {getMentionByOpenalexId} from '~/utils/getOpenalex'
import useSnackbar from '~/components/snackbar/useSnackbar'

type FindProjectMentionProps={
  id:string,
  config: {
    title:string,
    minLength:number,
    label: string,
    help: string
  },
  findPublicationByTitle:({
    id,
    searchFor,
    token
  }:{
    id:string,
    searchFor:string,
    token:string
  })=>Promise<MentionItemProps[]>
}

export default function FindMentionSection({id,config,findPublicationByTitle}:FindProjectMentionProps) {
  const {token} = useSession()
  const {onAdd} = useEditMentionReducer()
  const {showErrorMessage} = useSnackbar()

  async function findPublication(searchFor: string): Promise<MentionItemProps[]> {
    const searchData = extractSearchTerm(searchFor)
    switch (searchData.type) {
      case 'doi': {
        searchFor = searchData.term
        // look first at RSD
        const rsd = await getMentionByDoiFromRsd({
          doi: searchFor,
          token
        })
        if (rsd?.status === 200 && rsd.message?.length === 1) {
          // return first found item in RSD
          const item: MentionItemProps = rsd.message[0]
          return [item]
        }
        // else find by DOI
        const resp = await getMentionByDoi(searchFor)
        if (resp?.status === 200) {
          return [resp.message as MentionItemProps]
        } else {
          const errorMessage = resp?.message ? 'Error importing mention: ' + resp.message : 'Error importing mention'
          showErrorMessage(errorMessage)
          return []
        }
      }
      case 'openalex': {
        searchFor = searchData.term
        // look first at RSD
        const rsd = await getMentionByOpenalexIdFromRsd({
          id: searchFor,
          token
        })
        if (rsd?.status === 200 && rsd.message?.length === 1) {
          // return first found item in RSD
          const item: MentionItemProps = rsd.message[0]
          return [item]
        }
        // else find by DOI
        const resp = await getMentionByOpenalexId(searchFor)
        if (resp?.status === 200) {
          return [resp.message as MentionItemProps]
        }
        return []
      }
      case 'title': {
        searchFor = searchData.term
        // find by title
        const mentions = await findPublicationByTitle({
          id: id,
          searchFor,
          token
        })
        return mentions
      }
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.title}
        // subtitle={config.findMention.subtitle}
      />
      <h3 className="pt-4 pb-2 text-lg">Search</h3>
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
              minLength: config.minLength,
              label: config.label,
              help: config.help,
              reset: true,
              variant: 'standard'
            }}
          />
        </div>
      </FindMentionInfoPanel>
    </>
  )
}
