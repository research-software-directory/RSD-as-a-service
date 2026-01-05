// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {ProjectOfOrganisation} from '~/types/Organisation'
import {patchProjectForOrganisation} from '~/components/projects/edit/apiEditProject'
import logger from '~/utils/logger'
import useOrganisationContext from '../../context/useOrganisationContext'
import useAdminMenuOptions from '../useAdminMenuOptions'

export type ProjectCardWithMenuProps = {
  project: ProjectOfOrganisation
}

export type ProjectMenuAction = {
  type: 'PIN' | 'UNPIN' | 'DENY' | 'APPROVE',
  payload?: string
}

/**
 * Card actions hook. It defines menu options and performs the updates.
 * NOTE! After db update the project object passed to hook is also updated and "refresh" signal is send.
 * The refresh signal will case hook to reload.
 */
export function useProjectCardActions({project}: ProjectCardWithMenuProps) {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {showErrorMessage} = useSnackbar()
  const {menuOptions} = useAdminMenuOptions({
    status: project.status,
    is_published: project.is_published,
    is_featured: project.is_featured,
    target: 'project'
  })
  // refresh "signal" for child component(s) to reload project item after update and update menuOptions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refresh,setRefresh] = useState<number>(0)

  // console.group('useProjectCardActions')
  // console.log('id...', id)
  // console.log('token...', token)
  // console.log('refresh...', refresh)
  // console.log('menuOptions...', menuOptions)
  // console.groupEnd()

  async function setPinned(is_featured: boolean) {
    const pin = await patchProjectForOrganisation({
      project: project?.id ?? '',
      organisation: id ?? '',
      token,
      data: {
        is_featured
      }
    })
    if (pin.status !== 200) {
      showErrorMessage(`Failed to update ${project.title}. ${pin.message}`)
    } else {
      // directly update object value

      project.is_featured = is_featured
      // send refresh signal
      // TO BE USED BY child component to reload item
      setRefresh(v=>v+1)
    }
  }

  async function setStatus(status: 'approved' | 'rejected_by_relation') {
    const resp = await patchProjectForOrganisation({
      project: project.id,
      organisation: id ?? '',
      token,
      data: {
        status
      }
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to update ${project.title}. ${resp.message}`)
    } else {
      // directly update object value

      project.status = status
      // send refresh signal
      // TO BE USED BY child component to reload item
      setRefresh(v=>v+1)
    }
  }

  function onAction(action: ProjectMenuAction) {
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
        logger(`Action type ${action.type} NOT SUPPORTED. Check your spelling.`, 'warn')
    }
  }

  return {
    menuOptions,
    onAction
  }
}
