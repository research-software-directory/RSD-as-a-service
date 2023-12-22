// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import {useProfileContext} from '../context/ProfileContext'
import {ProfileTabKey, profileTabItems} from './ProfileTabItems'

type ProfileTabsProps={
  tab_id: ProfileTabKey,
  isMaintainer: boolean
}

// extract tab items (object keys)
const tabItems = Object.keys(profileTabItems) as ProfileTabKey[]

export default function ProfileTabs({tab_id, isMaintainer}:ProfileTabsProps) {
  const router = useRouter()
  const {software_cnt,project_cnt} = useProfileContext()
  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={tab_id}
      onChange={(_, value) => {
        // change tab
        const query:any={
          orcid: router.query['orcid'],
          tab: value,
        }
        // push tab change
        router.push({query},undefined,{scroll:false})
      }}
      aria-label="profile tabs"
    >
      {tabItems.map(key => {
        const item = profileTabItems[key]
        if (item.isVisible({isMaintainer})===true){
          return <Tab
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
              project_cnt
            })}
            value={key}
          />
        }
      })}
    </Tabs>
  )
}
