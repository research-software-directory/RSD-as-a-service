// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth'
import ImportMentions from '~/components/mention/ImportMentions/index'
import ImportMentionsInfoPanel from '~/components/mention/ImportMentions/ImportMentionsInfoPanel'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import {getImpactForProject} from '~/utils/getProjects'
import {cfgImpact as config} from './config'

export default function ImportProjectImpact() {
  const {project} = useProjectContext()
  const {setMentions, setLoading} = useEditMentionReducer()
  const {token} = useSession()

  async function reloadImpact() {
    setLoading(true)
    const data = await getImpactForProject({project: project.id, token: token, frontend: true})
    setMentions(data)
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
