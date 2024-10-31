// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import {useSession} from '~/auth'
import logger from '~/utils/logger'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {useCommunityContext} from '../../context'
import {CommunityRequestStatus, SoftwareOfCommunity, patchSoftwareForCommunity} from '../apiCommunitySoftware'
import useAdminMenuOptions from './useAdminMenuOptions'

export type SoftwareCardWithMenuProps = {
  software: SoftwareOfCommunity
}

export type SoftwareMenuAction = {
  type: 'APPROVE' | 'DENY' | 'PENDING',
  payload?: string
}

export function useSoftwareCardActions({software}: SoftwareCardWithMenuProps) {
  const {token} = useSession()
  const {community:{id}} = useCommunityContext()
  const {showErrorMessage} = useSnackbar()
  const {menuOptions} = useAdminMenuOptions({
    status: software.status,
    is_published: software.is_published
  })

  // refresh "signal" for child component(s) to reload project item after update
  // and updated menuOptions
  const [,setRefresh] = useState<number>(0)

  async function setStatus(status: CommunityRequestStatus) {
    const resp = await patchSoftwareForCommunity({
      software: software.id,
      community: id ?? '',
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
      case 'APPROVE':
        setStatus('approved')
        break
      case 'DENY':
        setStatus('rejected')
        break
      case 'PENDING':
        setStatus('pending')
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
