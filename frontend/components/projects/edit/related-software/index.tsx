// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {getRelatedSoftwareForProject} from '~/components/projects/apiProjects'
import {addRelatedSoftware, deleteRelatedSoftware} from '~/components/projects/edit/apiEditProject'
import {sortOnStrProp} from '~/utils/sortFn'
import {RelatedSoftwareOfProject, SearchSoftware} from '~/types/SoftwareTypes'
import {OrganisationStatus} from '~/types/Organisation'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import EditSection from '~/components/layout/EditSection'
import FindRelatedSoftware from './FindRelatedSoftware'
import {relatedSoftware as config} from '~/components/software/edit/related-software/config'
import useProjectContext from '../context/useProjectContext'
import RelatedSoftwareList from './RelatedSoftwareList'

export default function RelatedSoftwareForProject() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {project} = useProjectContext()
  const [relatedSoftware, setRelatedSoftware] = useState<RelatedSoftwareOfProject[]>()
  const [loadedProject, setLoadedProject] = useState('')

  useEffect(() => {
    let abort = false
    async function getRelatedSoftware() {
      // setLoading(true)
      const software = await getRelatedSoftwareForProject({
        project: project.id,
        token,
        approved: false
      })
      if (abort) return null
      setRelatedSoftware(software)
      setLoadedProject(project.id)
      // setLoading(false)
    }
    if (project.id && token &&
      project.id !== loadedProject) {
      getRelatedSoftware()
    }
    return ()=>{abort=true}
  },[project.id,token,loadedProject])

  async function onAdd(selected: SearchSoftware) {
    if (typeof relatedSoftware == 'undefined') return
    // check if already exists
    const find = relatedSoftware.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // default status is set to approved without validation
      const status:OrganisationStatus = 'approved'
      // add selected item to related software
      const resp = await addRelatedSoftware({
        project: project.id,
        software: selected.id,
        status,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        // update local state
        const newList = [
          ...relatedSoftware,
          {
            ...selected,
            // add status
            status,
            project: project.id,
            is_featured: false
          }
        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
        setRelatedSoftware(newList)
      }
    }
  }

  async function onRemove(pos: number) {
    if (typeof relatedSoftware == 'undefined') return
    // remove(pos)
    const software = relatedSoftware[pos]
    if (software) {
      const resp = await deleteRelatedSoftware({
        project: project.id,
        software: software.id,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedSoftware.slice(0, pos),
          ...relatedSoftware.slice(pos+1)
        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
        setRelatedSoftware(newList)
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
          {relatedSoftware && relatedSoftware.length > 0 ?
            <div className="pl-4 text-2xl">{relatedSoftware.length}</div>
            : null
          }
        </EditSectionTitle>
        <RelatedSoftwareList
          software={relatedSoftware}
          onRemove={onRemove}
        />
      </section>
      <section className="py-4">
        <EditSectionTitle
          title={config.findTitle}
          subtitle={config.findSubTitle}
        />
        <FindRelatedSoftware
          software={''}
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
