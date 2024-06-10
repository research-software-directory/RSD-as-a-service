// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import Check from '@mui/icons-material/Check'
import PendingActionsIcon from '@mui/icons-material/PendingActions'

import {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import {CommunityRequestStatus} from '../apiCommunitySoftware'
import {SoftwareMenuAction} from './useSoftwareCardActions'

type AdminMenuOptionsProps = {
  status: CommunityRequestStatus
  is_published: boolean
}

export default function useAdminMenuOptions({
  status, is_published
}: AdminMenuOptionsProps) {

  const [menuOptions, setMenuOptions] = useState<IconBtnMenuOption<SoftwareMenuAction>[]>([])

  useEffect(() => {
    let abort = false
    if (typeof status !='undefined') {
      const options: IconBtnMenuOption<SoftwareMenuAction>[] = []
      // accept/reject pending requests
      if (status==='pending'){
        options.push({
          type: 'action',
          key: 'approve',
          label: 'Allow affiliation',
          icon: <Check />,
          action: {type: 'APPROVE'}
        },{
          type: 'action',
          key: 'deny',
          label: 'Reject affiliation',
          icon: <RemoveCircleIcon/>,
          action: {type: 'DENY'}
        })
      } else if (status === 'approved') {
        options.push({
          type: 'action',
          key: 'deny',
          label: 'Reject affiliation',
          icon: <RemoveCircleIcon/>,
          action: {type: 'DENY'}
        },{
          type: 'action',
          key: 'pending',
          label: 'Postpone affiliation',
          icon: <PendingActionsIcon/>,
          action: {type: 'PENDING'}
        })
      } else {
        // rejected status
        options.push({
          type: 'action',
          key: 'approve',
          label: 'Allow affiliation',
          icon: <Check />,
          action: {type: 'APPROVE'}
        },{
          type: 'action',
          key: 'pending',
          label: 'Postpone affiliation',
          icon: <PendingActionsIcon/>,
          action: {type: 'PENDING'}
        })
      }
      if (abort) return
      setMenuOptions(options)
    }
    return ()=>{abort=true}
  }, [status,is_published])

  return {
    menuOptions
  }
}
