// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'


import {useSession} from '~/auth/AuthProvider'
import TerminalIcon from '@mui/icons-material/Terminal'
import ListAltIcon from '@mui/icons-material/ListAlt'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import useRsdSettings from '~/config/useRsdSettings'

type AddItemMenuItem={
  type: 'link' | 'divider'
  label: string
  icon: JSX.Element,
  path?: string,
  // used to customize menu items per user/profile
  active:(props:any)=>boolean
}

export const addItemMenu:AddItemMenuItem[]=[{
  type: 'link',
  label: 'New Software',
  icon: <TerminalIcon/>,
  path: '/add/software',
  active: ({modules})=>modules.includes('software')
},{
  type: 'link',
  label: 'New Project',
  icon: <ListAltIcon/>,
  path: '/add/project',
  active: ({modules})=>modules.includes('projects')
},{
  type: 'link',
  label: 'Add News',
  icon: <NewspaperIcon/>,
  path: '/add/news',
  active: ({role,modules})=> {
    return role ==='rsd_admin' && modules.includes('news')
  }
}]


const useAddItemMenu=jest.fn(()=>{
  const {user} = useSession()
  const {activeModules} = useRsdSettings()

  const menuItems = addItemMenu.filter(item=>{
    return item.active({role: user?.role, modules:activeModules}) ?? false
  })

  // console.group('useAddItemMenu')
  // console.log('user...', user)
  // console.log('host...', host)
  // console.log('menuItems...', menuItems)
  // console.groupEnd()

  return menuItems
})

export default useAddItemMenu
