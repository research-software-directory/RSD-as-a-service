// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useAuth} from '~/auth'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import FindMention from '~/components/mention/FindMention'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import AddExistingPublicationInfo from '~/components/software/edit/mentions/AddExistingPublicationInfo'
import {MentionItemProps} from '~/types/Mention'
import {getMentionByDoiFromRsd} from '~/utils/editMentions'
import {getMentionByDoi} from '~/utils/getDOI'
import useProjectContext from '../useProjectContext'
import {cfgImpact as config} from './config'
import {findPublicationByTitle} from './impactForProjectApi'

export default function FindImpact() {
  const {session: {token}} = useAuth()
  const {onAdd} = useEditMentionReducer()
  const {project} = useProjectContext()

  async function findPublication(searchFor: string) {
    // regex validation if DOI string
    const doiRegexMatch = searchFor.match(/^\s*((https?:\/\/)?(www\.)?(dx\.)?doi\.org\/)?(10(\.\w+)+\/\S+)\s*$/)
    if (doiRegexMatch !== null && doiRegexMatch[5] !== undefined) {
      searchFor = doiRegexMatch[5]
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
    } else {
      // find by title
      const mentions = await findPublicationByTitle({
        project: project.id,
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
        subtitle={config.findMention.subtitle}
      />
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
          reset: false
        }}
      />
      <AddExistingPublicationInfo />
    </>
  )
}
