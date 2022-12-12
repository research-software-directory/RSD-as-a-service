// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import logger from '~/utils/logger'
import {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {OrganisationForOverview, SoftwareOfOrganisation} from '~/types/Organisation'
import {patchSoftwareForOrganisation} from './patchSoftwareForOrganisation'

export type SoftwareCardWithMenuProps = {
  organisation: OrganisationForOverview,
  item: SoftwareOfOrganisation
  token: string
}

export type SoftwareMenuAction = {
  type: 'PIN' | 'UNPIN' | 'DENY' | 'APPROVE',
  payload?: string
}

export function useSoftwareCardActions({organisation, item, token}: SoftwareCardWithMenuProps) {
  const {showErrorMessage, showSuccessMessage} = useSnackbar()
  const [software, setSoftware] = useState<SoftwareOfOrganisation>(item)
  const [menuOptions, setMenuOptions] = useState<IconBtnMenuOption<SoftwareMenuAction>[]>([])

  useEffect(() => {
    let abort = false
    if (typeof software !='undefined') {
      const options: IconBtnMenuOption<SoftwareMenuAction>[] = []
      if (software.status === 'approved') {
        options.push({
          type: 'action', key: 'deny', label: 'Deny affiliation', action: {type: 'DENY'}
        })
      } else {
        options.push({
          type: 'action', key: 'approve', label: 'Approve affiliation', action: {type: 'APPROVE'}
        })
      }
      if (software.is_published) {
        if (software.is_featured) {
          options.push({
            type: 'action', key: 'unpin', label: 'Unpin software', action: {type: 'UNPIN'}
          })
        } else {
          options.push({
            type: 'action', key: 'pin', label: 'Pin software', action: {type: 'PIN'}
          })
        }
      }
      if (abort) return
      setMenuOptions(options)
    }
    return ()=>{abort=true}
  }, [software])

  async function setPinned(is_featured: boolean) {
    const pin = await patchSoftwareForOrganisation({
      software: software?.id ?? '',
      organisation: organisation.id,
      token,
      data: {
        is_featured
      }
    })
    if (pin.status !== 200) {
      showErrorMessage(`Failed to update ${software.brand_name}. ${pin.message}`)
    } else {
      showSuccessMessage(`${software.brand_name} ${is_featured ? ' PINNED' : ' UNPINNEND'}`)
      const updated = {
        ...software,
        is_featured
      }
      setSoftware(updated)
    }
  }

  async function setStatus(status: 'approved' | 'rejected_by_relation') {
    const resp = await patchSoftwareForOrganisation({
      software: software.id,
      organisation: organisation.id,
      token,
      data: {
        status
      }
    })
    if (resp.status !== 200) {
      showErrorMessage(`Failed to update ${software.brand_name}. ${resp.message}`)
    } else {
      let message = `${software.brand_name} is `
      if (status === 'approved') {
        message += `approved as software of ${organisation.name}`
      } else {
        message += `DENIED affiliation with ${organisation.name}`
      }
      showSuccessMessage(message)
      const updated = {
        ...software,
        status
      }
      setSoftware(updated)
    }
  }

  function onAction(action: SoftwareMenuAction) {
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
    software,
    setSoftware,
    menuOptions,
    onAction
  }
}
