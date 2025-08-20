// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {SoftwareOfOrganisation} from '~/types/Organisation'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {patchSoftwareForOrganisation} from '../patchSoftwareForOrganisation'
import useOrganisationContext from '../../context/useOrganisationContext'
import useAdminMenuOptions from '../../projects/useAdminMenuOptions'

export type SoftwareCardWithMenuProps = {
  software: SoftwareOfOrganisation
}

export type SoftwareMenuAction = {
  type: 'PIN' | 'UNPIN' | 'DENY' | 'APPROVE',
  payload?: string
}

export function useSoftwareCardActions({software}: SoftwareCardWithMenuProps) {
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {showErrorMessage} = useSnackbar()
  const {menuOptions} = useAdminMenuOptions({
    status: software.status,
    is_published: software.is_published,
    is_featured: software.is_featured,
    target: 'software'
  })

  // refresh "signal" for child component(s) to reload project item after update and update menuOptions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [refresh, setRefresh] = useState<number>(0)

  async function setPinned(is_featured: boolean) {
    const pin = await patchSoftwareForOrganisation({
      software: software?.id ?? '',
      organisation: id ?? '',
      token,
      data: {
        is_featured
      }
    })
    if (pin.status !== 200) {
      showErrorMessage(`Failed to update ${software.brand_name}. ${pin.message}`)
    } else {
      // showSuccessMessage(`${software.brand_name} ${is_featured ? ' PINNED' : ' UNPINNEND'}`)
      // directly update object value
      software.is_featured = is_featured
      // send refresh signal
      // TO BE USED BY child component to relaod item
      setRefresh(v=>v+1)
    }
  }

  async function setStatus(status: 'approved' | 'rejected_by_relation') {
    const resp = await patchSoftwareForOrganisation({
      software: software.id,
      organisation: id ?? '',
      token,
      data: {
        status
      }
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to update ${software.brand_name}. ${resp.message}`)
    } else {
      // directly update object value
      software.status = status
      // send refresh signal - to reload changes
      setRefresh(v=>v+1)
    }
  }

  function onAction(action: SoftwareMenuAction) {
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
    menuOptions,
    onAction
  }
}
