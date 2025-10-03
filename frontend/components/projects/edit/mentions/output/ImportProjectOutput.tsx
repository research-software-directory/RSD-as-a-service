// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth/AuthProvider'
import {getMentionsForProject} from '~/components/projects/apiProjects'
import ImportMentions from '~/components/mention/ImportMentions/index'
import ImportMentionsInfoPanel from '~/components/mention/ImportMentions/ImportMentionsInfoPanel'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useProjectContext from '~/components/projects/edit/context/useProjectContext'
import {useProjectMentionContext} from '../ProjectMentionContext'
import {cfgOutput as config} from './config'

export default function ImportProjectOutput() {
  const {project} = useProjectContext()
  const {setMentions, setLoading} = useEditMentionReducer()
  const {token} = useSession()
  const {setOutputCnt} = useProjectMentionContext()

  async function reloadOutput() {
    setLoading(true)
    const data = await getMentionsForProject({project: project.id,table:'output_for_project',token: token})
    setMentions(data)
    setOutputCnt(data?.length ?? 0)
    setLoading(false)
  }

  return (
    <>
      <h3 className="pt-4 pb-2 text-lg">{config.builkImport.title}</h3>
      <ImportMentionsInfoPanel>
        <div className="pt-4">
          <ImportMentions
            table="output_for_project"
            entityId={project.id!}
            onSuccess={reloadOutput} />
        </div>
      </ImportMentionsInfoPanel>
    </>
  )
}
