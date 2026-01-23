// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import EditIcon from '@mui/icons-material/Edit'
import ArticleIcon from '@mui/icons-material/Article'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import VisibilityIcon from '@mui/icons-material/Visibility'

import {IconBtnMenuOption} from '~/components/menu/IconBtnMenuOnAction'

export type UserMenuAction = {
  type: 'VIEW' | 'EDIT' | 'PUBLISH' | 'UNPUBLISH',
  payload?: string
}

type UseUserMenuOptionsProps=Readonly<{
  is_published:boolean
}>

export default function useUserMenuOptions({is_published}:UseUserMenuOptionsProps) {
  const menuOptions:IconBtnMenuOption<UserMenuAction>[]=[{
    type: 'action',
    key:'edit',
    label:'Edit',
    icon: <EditIcon />,
    action:{
      type: 'EDIT'
    }
  },{
    type: 'action',
    key:'view',
    label:'View',
    icon: <ArticleIcon />,
    action:{
      type: 'VIEW'
    }
  }]

  if (is_published===true){
    menuOptions.push({
      type: 'action',
      key:'unpublish',
      label:'Unpublish',
      icon: <VisibilityOffIcon />,
      action:{
        type: 'UNPUBLISH'
      }
    })
  }else{
    menuOptions.push({
      type: 'action',
      key:'publish',
      label:'Publish',
      icon: <VisibilityIcon />,
      action:{
        type: 'PUBLISH'
      }
    })
  }

  return menuOptions
}
