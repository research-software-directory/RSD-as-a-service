// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {userMenuItems} from './menuItems'
import {useSession} from '~/auth'
import useRsdSettings from './useRsdSettings'

export default function useUserMenuItems(){
  const {user} = useSession()
  const {host} = useRsdSettings()

  const items = userMenuItems.filter(item=>{
    if (item.active){
      return item.active({role: user?.role, modules: host.modules})
    }
    return true
  })

  return items
}
