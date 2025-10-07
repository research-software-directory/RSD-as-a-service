// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useParams} from 'next/navigation'
import Tabs from '@mui/material/Tabs'

import useRsdSettings from '~/config/useRsdSettings'
import TabAsLink from '~/components/layout/TabAsLink'
import {useProfileContext} from '~/components/profile/context/ProfileContext'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {ProfileTabKey, defaultTabId, profileTabItems} from './ProfileTabItems'

// extract tab items (object keys)
const tabItems = Object.keys(profileTabItems) as ProfileTabKey[]

export default function ProfileTabs() {
  const params = useParams()
  const {activeModules} = useRsdSettings()
  const {software_cnt,project_cnt} = useProfileContext()

  // console.group('ProfileTabs')
  // console.log('params...', params)
  // console.log('software_cnt...', software_cnt)
  // console.log('project_cnt...', project_cnt)
  // console.groupEnd()

  // if only one module active we do not show tabs
  if (
    activeModules.includes('software')===false ||
    activeModules.includes('projects')===false
  ){
    return (
      <div className="my-2"></div>
    )
  }

  const tab_id = params?.tab ?? defaultTabId
  const uuid = params?.id

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
          const url = `/persons/${uuid}/${key}`
          // console.log('url...', url)
          if (item.isVisible({isMaintainer:false,modules:activeModules})===true){
            return (
              <TabAsLink
                key={key}
                href={url}
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
