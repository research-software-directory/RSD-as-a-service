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
  pending_cnt: number
  rejected_cnt: number
  description: string | null
  isMaintainer: boolean
}

export default function CommunityTabs({
  tab,software_cnt,pending_cnt,rejected_cnt,
  description,isMaintainer
}:CommunityTabsProps) {

  const router = useRouter()

  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={tab}
      onChange={(_, value) => {
        // create url
        const url:any={
          pathname:`/communities/[slug]/${value}`,
          query:{
            slug: router.query['slug']
          }
        }
        // add default order for software and project tabs
        if (value === 'software' ||
          value === 'requests' ||
          value === 'rejected'
        ) {
          url.query['order'] = 'mention_cnt'
        }
        // push route change
        router.push(url,undefined,{scroll:false})
      }}
      aria-label="community tabs"
    >
      {tabItems.map(key => {
        const item = communityTabItems[key]
        if (item.isVisible({
          isMaintainer,
          description
        }) === true) {
          return <Tab
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
              pending_cnt,
              rejected_cnt
            })}
            value={key}
            sx={{
              minWidth:'9rem'
            }}
          />
        }})}
    </Tabs>
  )
}
