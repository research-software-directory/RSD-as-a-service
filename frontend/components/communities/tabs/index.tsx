// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import {useRouter} from 'next/router'
import {TabKey, communityTabItems} from './CommunityTabItems'

// extract tab items (object keys)
const tabItems = Object.keys(communityTabItems) as TabKey[]

type CommunityTabsProps={
  tab:TabKey
  software_cnt: number
  description: string | null
  isMaintainer: boolean
}

export default function CommunityTabs({
  tab,software_cnt,description,
  isMaintainer}:CommunityTabsProps) {

  const router = useRouter()
  // default tab is software
  // let select_tab:TabKey = 'software'

  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={tab}
      onChange={(_, value) => {
        const query:any={
          slug: router.query['slug'],
          tab: value,
        }
        // add default order for software and project tabs
        if (value === 'software') {
          query['order'] = 'is_featured'
        }
        // push route change
        router.push({query},undefined,{scroll:false})
      }}
      aria-label="community tabs"
    >
      {tabItems.map(key => {
        const item = communityTabItems[key]
        if (item.isVisible({
          isMaintainer,
          software_cnt,
          description
        }) === true) {
          return <Tab
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
            })}
            value={key}
          />
        }})}
    </Tabs>
  )
}
