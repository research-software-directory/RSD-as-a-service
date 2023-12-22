// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import {getMentionsForSoftware} from '~/utils/editMentions'
import ImportMentions from '~/components/mention/ImportMentions/index'
import ImportMentionsInfoPanel from '~/components/mention/ImportMentions/ImportMentionsInfoPanel'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useSoftwareContext from '../useSoftwareContext'
import {cfgMention as config} from './config'

export default function ImportSoftwareMentions() {
  const {software} = useSoftwareContext()
  const {setMentions, setLoading} = useEditMentionReducer()
  const {token} = useSession()

  async function reloadMentions() {
    setLoading(true)
    const data = await getMentionsForSoftware({software: software.id, token: token})
    setMentions(data)
    setLoading(false)
  }

  return (
    <>
      <h3 className="pt-4 pb-2 text-lg">{config.builkImport.title}</h3>
      <ImportMentionsInfoPanel>
        <div className="pt-4">
          <ImportMentions
            table="mention_for_software"
            entityId={software.id!}
            onSuccess={reloadMentions} />
        </div>
      </ImportMentionsInfoPanel>
    </>
  )
}
