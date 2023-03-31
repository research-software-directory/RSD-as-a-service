// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import BulkImport from '~/components/mention/BulkImport'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import {getImpactForProject} from '~/utils/getProjects'


export default function BulkImportImpact() {
  const {project} = useProjectContext()
  const {setMentions, setLoading} = useEditMentionReducer()
  const {token} = useSession()

  async function reloadImpact() {
    setLoading(true)
    const data = await getImpactForProject({project: project.id, token: token, frontend: true})
    setMentions(data)
    setLoading(false)
  }

  return <BulkImport table="impact_for_project" entityId={project.id!} onAdded={reloadImpact}></BulkImport>
}
