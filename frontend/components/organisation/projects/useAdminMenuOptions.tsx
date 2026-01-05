// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

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

  const menuOptions:IconBtnMenuOption<ProjectMenuAction>[]=[]

  if (typeof status !='undefined') {
    if (status === 'approved') {
      menuOptions.push({
        type: 'action',
        key: 'deny',
        label: 'Block affiliation',
        icon: <RemoveCircleIcon/>,
        action: {type: 'DENY'}
      })
    } else {
      menuOptions.push({
        type: 'action',
        key: 'approve',
        label: 'Allow affiliation',
        icon: <Check />,
        action: {type: 'APPROVE'}
      })
    }
    if (is_published) {
      if (is_featured) {
        menuOptions.push({
          type: 'action',
          key: 'unpin',
          label: `Unpin ${target}`,
          icon: <UndoIcon />,
          action: {type: 'UNPIN'}
        })
      } else {
        menuOptions.push({
          type: 'action',
          key: 'pin',
          label: `Pin ${target}`,
          icon: <FavoriteIcon />,
          action: {type: 'PIN'}
        })
      }
    }
  }

  return {
    menuOptions
  }
}
