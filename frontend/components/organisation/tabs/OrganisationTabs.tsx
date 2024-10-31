// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import {useRouter} from 'next/router'

import {TabKey, organisationTabItems} from './OrganisationTabItems'
import useOrganisationContext from '../context/useOrganisationContext'
import useSelectedTab from './useSelectedTab'

// extract tab items (object keys)
const tabItems = Object.keys(organisationTabItems) as TabKey[]

export default function OrganisationTabs({tab_id}:{tab_id:TabKey|null}) {
  const router = useRouter()
  const select_tab = useSelectedTab(tab_id)
  const {
    description, software_cnt,
    release_cnt, project_cnt,
    children_cnt, isMaintainer
  } = useOrganisationContext()

  // console.group('OrganisationTabs')
  // console.log('tab...', tab)
  // console.log('selected...', selected)
  // console.groupEnd()

  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={select_tab}
      onChange={(_, value) => {
        const query:any={
          slug: router.query['slug'],
          tab: value,
        }
        // push route change
        router.push({query},undefined,{scroll:false})
      }}
      aria-label="organisation tabs"
    >
      {tabItems.map(key => {
        const item = organisationTabItems[key]
        if (item.isVisible({
          isMaintainer,
          software_cnt,
          release_cnt,
          project_cnt,
          children_cnt,
          description
        })) {
          return <Tab
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
              release_cnt,
              project_cnt,
              children_cnt
            })}
            value={key}
          />
        }})}
    </Tabs>
  )
}
