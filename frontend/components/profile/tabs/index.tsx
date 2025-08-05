// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import Tabs from '@mui/material/Tabs'

import useRsdSettings from '~/config/useRsdSettings'
import TabAsLink from '~/components/layout/TabAsLink'
import {useProfileContext} from '~/components/profile/context/ProfileContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {ProfileTabKey, profileTabItems} from './ProfileTabItems'

type ProfileTabsProps={
  tab_id: ProfileTabKey,
  isMaintainer: boolean
}

// extract tab items (object keys)
const tabItems = Object.keys(profileTabItems) as ProfileTabKey[]

export default function ProfileTabs({tab_id, isMaintainer}:ProfileTabsProps) {
  const router = useRouter()
  const {activeModules} = useRsdSettings()
  const {software_cnt,project_cnt} = useProfileContext()

  // if only one module active we do not show tabs
  if (
    activeModules.includes('software')===false ||
    activeModules.includes('projects')===false
  ){
    return (
      <div className="my-2"></div>
    )
  }

  return (
    <BaseSurfaceRounded
      className="my-4 p-2"
      type="section"
    >
      <Tabs
        component="nav"
        variant="scrollable"
        allowScrollButtonsMobile
        value={tab_id}
        aria-label="profile tabs"
      >
        {tabItems.map(key => {
          const item = profileTabItems[key]
          if (item.isVisible({isMaintainer,modules:activeModules})===true){
            return (
              <TabAsLink
                key={key}
                href={`../${router.query['id']}/${key}`}
                value={key}
                icon={item.icon}
                label={item.label({
                  software_cnt,
                  project_cnt
                })}
              />
            )
          }
        })}
      </Tabs>
    </BaseSurfaceRounded>
  )
}
