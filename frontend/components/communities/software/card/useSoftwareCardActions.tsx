// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useRouter} from 'next/navigation'
import {useSession} from '~/auth/AuthProvider'
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
  const router = useRouter()
  const {community:{id}} = useCommunityContext()
  const {showErrorMessage} = useSnackbar()
  const {menuOptions} = useAdminMenuOptions({
    status: software.status,
    is_published: software.is_published
  })

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
      // refresh page to reflect changes
      router.refresh()
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
