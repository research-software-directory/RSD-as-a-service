// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import BulkImport from '~/components/mention/BulkImport'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import {getImpactForProject} from '~/utils/getProjects'
import useSoftwareContext from '../useSoftwareContext'
import {getMentionsForSoftware} from '~/utils/editMentions'


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

  return <BulkImport table="mention_for_software" entityId={software.id!} onAdded={reloadMentions}></BulkImport>
}
