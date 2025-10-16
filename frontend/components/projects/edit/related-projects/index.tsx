// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {getRelatedProjectsForProject} from '~/components/projects/apiProjects'
import {addRelatedProject, deleteRelatedProject} from '~/components/projects/edit/apiEditProject'
import {sortOnStrProp} from '~/utils/sortFn'
import {extractErrorMessages} from '~/utils/fetchHelpers'
import {ProjectStatusKey, RelatedProjectForProject, SearchProject} from '~/types/Project'
import {OrganisationStatus} from '~/types/Organisation'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import EditSection from '~/components/layout/EditSection'
import {relatedProject as config} from './config'
import FindRelatedProject from './FindRelatedProject'
import useProjectContext from '../context/useProjectContext'
import RelatedProjectList from './RelatedProjectList'

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
      const status:OrganisationStatus = 'approved'
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
    <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
      <section className="py-4">
        <EditSectionTitle
          title={config.title}
          // subtitle={config.subtitle}
        >
          {/* add count to title */}
          {relatedProject && relatedProject.length > 0 ?
            <div className="pl-4 text-2xl">{relatedProject.length}</div>
            : null
          }
        </EditSectionTitle>
        <RelatedProjectList
          projects={relatedProject}
          onRemove={onRemove}
        />
      </section>
      <section className="py-4">
        <EditSectionTitle
          title={config.findTitle}
          subtitle={config.findSubtitle}
        />
        <FindRelatedProject
          project={project.id}
          token={token}
          config={{
            freeSolo: false,
            minLength: config.validation.minLength,
            label: config.label,
            help: config.help,
            reset: true
          }}
          onAdd={onAdd}
        />
      </section>
    </EditSection>
  )
}
