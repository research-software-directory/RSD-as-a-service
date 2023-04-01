// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ImportMentions from '~/components/mention/ImportMentions/index'
import ImportMentionsInfo from '~/components/mention/ImportMentions/ImportMentionsInfo'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useSoftwareContext from '../useSoftwareContext'
import {getMentionsForSoftware} from '~/utils/editMentions'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {cfgMention as config} from './config'

export default function BulkImportMentions() {
  const {software} = useSoftwareContext()
  const {setMentions, setLoading} = useEditMentionReducer()
  const {token} = useSession()

  async function reloadMentions() {
    setLoading(true)
    const data = await getMentionsForSoftware({software: software.id, token: token, frontend: true})
    setMentions(data)
    setLoading(false)
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="pr-2">
          <EditSectionTitle
            title={config.builkImport.title}
            // subtitle={config.builkImport.subtitle}
          />
        </div>
        <ImportMentions
          table="mention_for_software"
          entityId={software.id!}
          onSuccess={reloadMentions} />
      </div>
      <div className="px-4"></div>
      <ImportMentionsInfo />
    </>
  )
}
