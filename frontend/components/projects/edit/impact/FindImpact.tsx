// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useAuth} from '~/auth'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import FindMention from '~/components/mention/FindMention'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {MentionItemProps} from '~/types/Mention'
import {extractMentionFromDoi} from '~/utils/getDOI'
import useProjectContext from '../useProjectContext'
import {cfgImpact as config} from './config'
import {findPublicationByTitle} from './impactForProjectApi'

export default function FindImpact() {
  const {session: {token}} = useAuth()
  const {onAdd} = useEditMentionReducer()
  const {project} = useProjectContext()

  async function findPublication(searchFor: string) {
    // regex validation if DOI string
    if (searchFor.match(/^10(\.\d+)+\/.+/) !== null) {
      // find by DOI
      const resp = await extractMentionFromDoi(searchFor)
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
          freeSolo: false,
          minLength: config.findMention.validation.minLength,
          label: config.findMention.label,
          help: config.findMention.help,
          reset: true
        }}
      />
    </>
  )
}
