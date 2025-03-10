// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import Check from '@mui/icons-material/Check'
import UndoIcon from '@mui/icons-material/Undo'

import {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'
import {OrganisationStatus} from '~/types/Organisation'
import {ProjectMenuAction} from './card/useProjectCardActions'

type AdminMenuOptionsProps = {
  status: OrganisationStatus
  is_published: boolean
  is_featured: boolean
  target: 'project'| 'software'
}

export default function useAdminMenuOptions({
  status,is_published,is_featured, target
}: AdminMenuOptionsProps) {

  const [menuOptions, setMenuOptions] = useState<IconBtnMenuOption<ProjectMenuAction>[]>([])

  useEffect(() => {
    let abort = false
    if (typeof status !='undefined') {
      const options: IconBtnMenuOption<ProjectMenuAction>[] = []
      if (status === 'approved') {
        options.push({
          type: 'action',
          key: 'deny',
          label: 'Block affiliation',
          icon: <RemoveCircleIcon/>,
          action: {type: 'DENY'}
        })
      } else {
        options.push({
          type: 'action',
          key: 'approve',
          label: 'Allow affiliation',
          icon: <Check />,
          action: {type: 'APPROVE'}
        })
      }
      if (is_published) {
        if (is_featured) {
          options.push({
            type: 'action',
            key: 'unpin',
            label: `Unpin ${target}`,
            icon: <UndoIcon />,
            action: {type: 'UNPIN'}
          })
        } else {
          options.push({
            type: 'action',
            key: 'pin',
            label: `Pin ${target}`,
            icon: <FavoriteIcon />,
            action: {type: 'PIN'}
          })
        }
      }
      if (abort) return
      setMenuOptions(options)
    }
    return ()=>{abort=true}
  }, [status,is_published,is_featured,target])

  return {
    menuOptions
  }
}
