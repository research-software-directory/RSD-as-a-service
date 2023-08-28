// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {cfgRelatedItems as config} from './config'
import {getRelatedProjectsForProject} from '~/utils/getProjects'
import {addRelatedProject, deleteRelatedProject} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import {ProjectStatusKey, RelatedProjectForProject, SearchProject} from '~/types/Project'
import FindRelatedProject from './FindRelatedProject'
import useProjectContext from '../useProjectContext'
import RelatedProjectList from './RelatedProjectList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {Status} from '~/types/Organisation'
import {extractErrorMessages} from '~/utils/fetchHelpers'

export default function RelatedProjectsForProject() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {project} = useProjectContext()
  const [relatedProject, setRelatedProject] = useState<RelatedProjectForProject[]>()
  const [loadedProject, setLoadedProject] = useState('')

  useEffect(() => {
    let abort = false
    async function getRelatedProjects() {
      // setLoading(true)
      const projects = await getRelatedProjectsForProject({
        project: project.id,
        token,
        frontend: true,
        approved: false,
        // order by title only
        order:'title.asc'
      })
      // check abort
      if (abort) return null
      // set local state
      setRelatedProject(projects)
      setLoadedProject(project.id)
      // setLoading(false)
    }
    if (project.id && token && project.id!==loadedProject) {
      getRelatedProjects()
    }
    return ()=>{abort=true}
  },[project.id,token,loadedProject])

  async function onAdd(selected: SearchProject) {
    if (typeof relatedProject=='undefined') return
    // check if already exists
    const find = relatedProject.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // default status is set to approved without validation
      const status:Status = 'approved'
      // append(selected)
      const resp = await addRelatedProject({
        origin: project.id,
        relation: selected.id,
        status,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related project. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject,
          {
            ...selected,
            origin: project.id,
            relation: selected.id,
            status,
            // these are not relevant but required in type
            date_start: null,
            updated_at: null,
            current_state: 'unknown' as ProjectStatusKey
          }
        ].sort((a, b) => sortOnStrProp(a, b, 'title'))
        setRelatedProject(newList)
      }
    }
  }

  async function onRemove(pos: number) {
    if (typeof relatedProject=='undefined') return
    // remove(pos)
    const related = relatedProject[pos]
    if (related) {
      // delete relation in both directions
      const promises = [
        deleteRelatedProject({
          origin: related.origin,
          relation: related.relation,
          token
        }),
        deleteRelatedProject({
          origin: related.relation,
          relation: related.origin,
          token
        })
      ]
      const responses = await Promise.all(promises)
      const errors = extractErrorMessages(responses)
      // return result
      if (errors.length > 0) {
        // return first error for now
        showErrorMessage(`Failed to remove related project. ${errors[0].message}`)
      } else {
        const newList = [
          ...relatedProject.slice(0, pos),
          ...relatedProject.slice(pos+1)
        ].sort((a, b) => sortOnStrProp(a, b, 'title'))
        setRelatedProject(newList)
      }
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.relatedProject.title}
        subtitle={config.relatedProject.subtitle}
      >
        {/* add count to title */}
        {relatedProject && relatedProject.length > 0 ?
          <div className="pl-4 text-2xl">{relatedProject.length}</div>
          : null
        }
      </EditSectionTitle>
      <FindRelatedProject
        project={project.id}
        token={token}
        config={{
          freeSolo: false,
          minLength: config.relatedProject.validation.minLength,
          label: config.relatedProject.label,
          help: config.relatedProject.help,
          reset: true
        }}
        onAdd={onAdd}
      />
      <div className="py-8">
        <RelatedProjectList
          projects={relatedProject}
          onRemove={onRemove}
        />
      </div>
    </>
  )
}
