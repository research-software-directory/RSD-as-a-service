// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {OrganisationForOverview, ProjectOfOrganisation} from '~/types/Organisation'
import {patchProjectForOrganisation} from '~/utils/editProject'
import logger from '~/utils/logger'

export type ProjectCardWithMenuProps = {
  organisation: OrganisationForOverview,
  item: ProjectOfOrganisation
}

export type ProjectMenuAction = {
  type: 'PIN' | 'UNPIN' | 'DENY' | 'APPROVE',
  payload?: string
}

export function useProjectCardActions({organisation, item}: ProjectCardWithMenuProps) {
  const {token} = useSession()
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const [project, setProject] = useState<ProjectOfOrganisation>(item)
  const [menuOptions, setMenuOptions] = useState<IconBtnMenuOption<ProjectMenuAction>[]>([])

  useEffect(() => {
    let abort = false
    if (typeof project !='undefined') {
      const options: IconBtnMenuOption<ProjectMenuAction>[] = []
      if (project.status === 'approved') {
        options.push({
          type: 'action', key: 'deny', label: 'Deny affiliation', action: {type: 'DENY'}
        })
      } else {
        options.push({
          type: 'action', key: 'approve', label: 'Approve affiliation', action: {type: 'APPROVE'}
        })
      }
      if (project.is_published) {
        if (project.is_featured) {
          options.push({
            type: 'action', key: 'unpin', label: 'Unpin project', action: {type: 'UNPIN'}
          })
        } else {
          options.push({
            type: 'action', key: 'pin', label: 'Pin project', action: {type: 'PIN'}
          })
        }
      }
      if (abort) return
      setMenuOptions(options)
    }
    return ()=>{abort=true}
  }, [project])

  async function setPinned(is_featured: boolean) {
    const pin = await patchProjectForOrganisation({
      project: project?.id ?? '',
      organisation: organisation.id,
      token,
      data: {
        is_featured
      }
    })
    if (pin.status !== 200) {
      showErrorMessage(`Failed to update ${project.title}. ${pin.message}`)
    } else {
      showSuccessMessage(`${project.title} ${is_featured ? ' pinned.' : ' unpinned.'}`)
      const updated = {
        ...project,
        is_featured
      }
      setProject(updated)
    }
  }

  async function setStatus(status: 'approved' | 'rejected_by_relation') {
    const resp = await patchProjectForOrganisation({
      project: project.id,
      organisation: organisation.id,
      token,
      data: {
        status
      }
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to update ${project.title}. ${resp.message}`)
    } else {
      let message = `${project.title} is `
      if (status === 'approved') {
        message += `approved as project of ${organisation.name}`
      } else {
        message += `DENIED affiliation with ${organisation.name}`
      }
      showSuccessMessage(message)
      const updated = {
        ...project,
        status
      }
      setProject(updated)
    }
  }

  function onAction(action: ProjectMenuAction) {
    // console.log('SoftwareCardWithMenu...action...', action)
    switch (action.type) {
      case 'PIN':
        setPinned(true)
        break
      case 'UNPIN':
        setPinned(false)
        break
      case 'DENY':
        setStatus('rejected_by_relation')
        break
      case 'APPROVE':
        setStatus('approved')
        break
      default:
        logger(`Action type ${action.type} NOT SUPORTED. Check your spelling.`, 'warn')
    }
  }

  return {
    project,
    setProject,
    menuOptions,
    onAction
  }
}
