// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Tabs from '@mui/material/Tabs'
import {useRouter} from 'next/router'
import {CommunityTabItemProps, TabKey, communityTabItems} from './CommunityTabItems'
import TabAsLink from '~/components/layout/TabAsLink'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'

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

  // filter tabs to show to this user
  const activeTabs:CommunityTabItemProps[] = []
  tabItems.forEach((key)=>{
    if (communityTabItems[key].isVisible({
      isMaintainer,
      description
    })===true){
      activeTabs.push(communityTabItems[key])
    }
  })

  // do not show tabs if only one item to show
  if (activeTabs.length < 2){
    return null
  }

  return (
    <BaseSurfaceRounded
      className="mt-4 p-2"
      type="section"
    >
      <Tabs
        variant="scrollable"
        allowScrollButtonsMobile
        value={tab}
        aria-label="community tabs"
      >
        {activeTabs?.map(item=>{
          return <TabAsLink
            icon={item.icon}
            key={item.id}
            label={item.label({
              software_cnt,
              pending_cnt,
              rejected_cnt
            })}
            value={item.id}
            sx={{
              minWidth: '9rem'
            }}
            href={`/communities/${router.query['slug']}/${item.id}`}
            scroll={false}
          />
        })}
      </Tabs>
    </BaseSurfaceRounded>
  )
}
