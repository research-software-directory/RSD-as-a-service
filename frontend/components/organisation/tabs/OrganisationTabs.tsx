// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useSearchParams, useParams} from 'next/navigation'
import Tabs from '@mui/material/Tabs'

import useRsdSettings from '~/config/useRsdSettings'
import TabAsLink from '~/components/layout/TabAsLink'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import {TabKey, organisationTabItems} from './OrganisationTabItems'
import useSelectedTab from './useSelectedTab'

// extract tab items (object keys)
const tabItems = Object.keys(organisationTabItems) as TabKey[]

export default function OrganisationTabs() {
  const params = useParams()
  const query = useSearchParams()
  const {activeModules} = useRsdSettings()
  const select_tab = useSelectedTab(query?.get('tab') as TabKey ?? null)
  const {
    description, software_cnt,
    release_cnt, project_cnt,
    children_cnt, isMaintainer
  } = useOrganisationContext()

  // console.group('OrganisationTabs')
  // console.log('params...', params)
  // console.log('select_tab...', select_tab)
  // console.log('activeModules...', activeModules)
  // console.groupEnd()

  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={select_tab}
      aria-label="organisation tabs"
    >
      {tabItems.map(key => {
        const item = organisationTabItems[key]
        const slugAsArray = params?.['slug'] ?? []
        let fullSlug: string
        if (Array.isArray(slugAsArray)) {
          fullSlug = slugAsArray.join('/')
        } else if (slugAsArray === undefined) {
          fullSlug = ''
        } else {
          fullSlug = slugAsArray
        }
        if (item.isVisible({
          isMaintainer,
          software_cnt,
          release_cnt,
          project_cnt,
          children_cnt,
          description,
          modules: activeModules
        })) {
          return <TabAsLink
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
              release_cnt,
              project_cnt,
              children_cnt
            })}
            value={key}
            href={`/organisations/${fullSlug}?tab=${key}`}
            scroll={false}
          />
        }})}
    </Tabs>
  )
}
