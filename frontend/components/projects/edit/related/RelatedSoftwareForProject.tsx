// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {RelatedSoftwareOfProject, SearchSoftware} from '~/types/SoftwareTypes'
import FindRelatedSoftware from './FindRelatedSoftware'
import {cfgRelatedItems as config} from './config'
import {getRelatedSoftwareForProject} from '~/utils/getProjects'
import {addRelatedSoftware, deleteRelatedSoftware} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import useProjectContext from '../useProjectContext'
import RelatedSoftwareList from './RelatedSoftwareList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {Status} from '~/types/Organisation'

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
        frontend: true,
        approved: false
      })
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
      const status:Status = 'approved'
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
    <>
      <EditSectionTitle
        title={config.relatedSoftware.title}
        subtitle={config.relatedSoftware.subtitle}
      >
        {/* add count to title */}
        {relatedSoftware && relatedSoftware.length > 0 ?
          <div className="pl-4 text-2xl">{relatedSoftware.length}</div>
          : null
        }
      </EditSectionTitle>
      <FindRelatedSoftware
        software={''}
        token={token}
        config={{
          freeSolo: false,
          minLength: config.relatedSoftware.validation.minLength,
          label: config.relatedSoftware.label,
          help: config.relatedSoftware.help,
          reset: true
        }}
        onAdd={onAdd}
      />
      <div className="py-8">
        <RelatedSoftwareList
          software={relatedSoftware}
          onRemove={onRemove}
        />
      </div>
    </>
  )
}
