// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {cfgRelatedItems as config} from './config'
import {getRelatedProjectsForProject} from '~/utils/getProjects'
import {addRelatedProject, deleteRelatedProject} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import {SearchProject} from '~/types/Project'
import FindRelatedProject from './FindRelatedProject'
import useProjectContext from '../useProjectContext'
import RelatedProjectList from './RelatedProjectList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {Status} from '~/types/Organisation'

export default function RelatedProjectsForProject() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {project} = useProjectContext()
  const [relatedProject, setRelatedProject] = useState<SearchProject[]>()
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
            status
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
      const resp = await deleteRelatedProject({
        origin: project.id,
        relation: related.id,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to remove related project. ${resp.message}`)
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
