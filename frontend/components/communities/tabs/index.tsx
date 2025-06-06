// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Tabs from '@mui/material/Tabs'
import {useRouter} from 'next/router'
import {TabKey, communityTabItems} from './CommunityTabItems'
import TabAsLink from '~/components/layout/TabAsLink'

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
      aria-label="community tabs"
    >
      {tabItems.map(key => {
        const item = communityTabItems[key]
        if (item.isVisible({
          isMaintainer,
          description
        })) {
          return <TabAsLink
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
              pending_cnt,
              rejected_cnt
            })}
            value={key}
            sx={{
              minWidth: '9rem'
            }}
            href={`/communities/${router.query['slug']}/${key}`}
            scroll={false}
          />
        }})}
    </Tabs>
  )
}
