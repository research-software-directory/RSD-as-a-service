// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tabs from '@mui/material/Tabs'

import {useSession} from '~/auth/AuthProvider'
import useRsdSettings from '~/config/useRsdSettings'
import {UserCounts, useUserContext} from '~/components/user/context/UserContext'
import {UserPageId, userTabItems} from './UserTabItems'
import TabAsLink from '~/components/layout/TabAsLink'

// extract tab items (object keys)
const tabItems = Object.keys(userTabItems) as UserPageId[]

function useSelectedTab(tab_id: UserPageId|null): UserPageId {
  // default tab is software
  let selected:UserPageId = 'software'

  // if tab provided use it
  if (tab_id !== null && userTabItems.hasOwnProperty(tab_id)) {
    selected = tab_id
  }
  return selected
}

export type UserTabsProps=Readonly<{
  tab: UserPageId
  counts: UserCounts
}>

export default function UserTabs({tab,counts}:UserTabsProps) {
  const select_tab = useSelectedTab(tab)
  const {activeModules} = useRsdSettings()
  const {user} = useSession()
  const {profile} = useUserContext()
  // rsd_admin and your own profile
  const isMaintainer = user?.role==='rsd_admin' ? true : user?.account === profile?.account

  // console.group('UserTabs')
  // console.log('select_tab...', select_tab)
  // console.log('profile...', profile)
  // console.groupEnd()

  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={select_tab}
      aria-label="User profile tabs"
    >
      {tabItems.map(key => {
        const item = userTabItems[key]
        if (item.isVisible({
          modules: activeModules,
          isMaintainer
        })) {
          return <TabAsLink
            icon={item.icon}
            key={key}
            label={item.label(counts)}
            value={key}
            href={key}
            scroll={false}
          />
        }})}
    </Tabs>
  )
}
