// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth/AuthProvider'
import ImportMentions from '~/components/mention/ImportMentions/index'
import ImportMentionsInfoPanel from '~/components/mention/ImportMentions/ImportMentionsInfoPanel'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useProjectContext from '~/components/projects/edit/context/useProjectContext'
import {getMentionsForProject} from '~/components/projects/apiProjects'
import {useProjectMentionContext} from '../ProjectMentionContext'
import {cfgImpact as config} from './config'

export default function ImportProjectImpact() {
  const {project} = useProjectContext()
  const {setMentions, setLoading} = useEditMentionReducer()
  const {token} = useSession()
  const {setImpactCnt} = useProjectMentionContext()

  async function reloadImpact() {
    setLoading(true)
    const data = await getMentionsForProject({project: project.id,table:'impact_for_project',token: token})
    setMentions(data)
    setImpactCnt(data?.length ?? 0)
    setLoading(false)
  }

  return (
    <>
      <h3 className="pt-4 pb-2 text-lg">{config.builkImport.title}</h3>
      <ImportMentionsInfoPanel>
        <div className="pt-4">
          <ImportMentions
            table="impact_for_project"
            entityId={project.id!}
            onSuccess={reloadImpact} />
        </div>
      </ImportMentionsInfoPanel>
    </>
  )
}
