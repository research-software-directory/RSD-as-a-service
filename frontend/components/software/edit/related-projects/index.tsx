// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {getRelatedProjectsForSoftware} from '~/components/software/apiSoftware'
import {addRelatedSoftware, deleteRelatedSoftware} from '~/components/projects/edit/apiEditProject'
import {sortOnStrProp} from '~/utils/sortFn'
import {OrganisationStatus} from '~/types/Organisation'
import {SearchProject} from '~/types/Project'
import useSnackbar from '~/components/snackbar/useSnackbar'
import FindRelatedProject from '~/components/projects/edit/related-projects/FindRelatedProject'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import RelatedProjectList from '~/components/projects/edit/related-projects/RelatedProjectList'
import EditSection from '~/components/layout/EditSection'
import {relatedProject as config} from '~/components/projects/edit/related-projects/config'
import useSoftwareContext from '../context/useSoftwareContext'

export default function RelatedProjectsForSoftware() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const [relatedProject, setRelatedProject] = useState<SearchProject[]>()
  const [loadedSoftware, setLoadedSoftware] = useState('')

  useEffect(() => {
    let abort = false
    async function getRelatedProjects() {
      const resp = await getRelatedProjectsForSoftware({
        software: software.id ?? '',
        token,
        approved: false
      })
      // order on title
      resp.sort((a, b) => sortOnStrProp(a, b, 'title'))
      if (abort) return null
      // debugger
      setRelatedProject(resp)
      setLoadedSoftware(software?.id ?? '')
    }
    if (software.id && token &&
      software?.id !== loadedSoftware) {
      getRelatedProjects()
    }
    return ()=>{abort=true}
  },[software.id,token,loadedSoftware])

  async function onAdd(selected: SearchProject) {
    if (typeof relatedProject=='undefined') return
    // check if already exists
    const find = relatedProject.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // default status of relation between software and project is approved
      const status:OrganisationStatus = 'approved'
      // append(selected)
      const resp = await addRelatedSoftware({
        software: software.id ?? '',
        project: selected.id,
        status,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related project. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject, {
            ...selected,
            origin: software.id,
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
      const resp = await deleteRelatedSoftware({
        software: software.id ?? '',
        project: related.id,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to delete related project. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject.slice(0, pos),
          ...relatedProject.slice(pos+1)
        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
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
          project={''}
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
