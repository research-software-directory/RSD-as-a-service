// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useParams} from 'next/navigation'
import Tabs from '@mui/material/Tabs'

import TabAsLink from '~/components/layout/TabAsLink'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {useCommunityContext} from '~/components/communities/context'
import {CommunityTabItemProps, TabKey, communityTabItems, defaultTabKey} from './CommunityTabItems'

// extract tab items (object keys)
const tabItems = Object.keys(communityTabItems) as TabKey[]

export default function CommunityTabs() {
  const params = useParams()
  const {community:{
    description,
    software_cnt,
    pending_cnt,
    rejected_cnt
  },isMaintainer} = useCommunityContext()

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

  // determine community page based on pathname and community slug
  const tab = params?.tab as TabKey ?? defaultTabKey

  // console.group('CommunityTabs')
  // console.log('slug...', params?.['slug'])
  // console.log('activeTabs...', activeTabs)
  // console.log('params...', params)
  // console.log('tab...', tab)
  // console.groupEnd()

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
            href={`/communities/${params?.['slug']}/${item.id}`}
            scroll={false}
          />
        })}
      </Tabs>
    </BaseSurfaceRounded>
  )
}
