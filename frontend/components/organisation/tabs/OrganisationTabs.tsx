// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Tabs from '@mui/material/Tabs'
import {useRouter} from 'next/router'

import useRsdSettings from '~/config/useRsdSettings'
import useOrganisationContext from '../context/useOrganisationContext'
import TabAsLink from '~/components/layout/TabAsLink'
import {TabKey, organisationTabItems} from './OrganisationTabItems'
import useSelectedTab from './useSelectedTab'

// extract tab items (object keys)
const tabItems = Object.keys(organisationTabItems) as TabKey[]

export default function OrganisationTabs({tab_id}:{tab_id:TabKey|null}) {
  const router = useRouter()
  const {host} = useRsdSettings()
  const select_tab = useSelectedTab(tab_id)
  const {
    description, software_cnt,
    release_cnt, project_cnt,
    children_cnt, isMaintainer
  } = useOrganisationContext()

  // console.group('OrganisationTabs')
  // console.log('tab...', tab_id)
  // console.log('select_tab...', select_tab)
  // console.log('modules...', host?.modules)
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
        const slugAsArray = router.query['slug']
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
          modules: host?.modules ?? []
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
