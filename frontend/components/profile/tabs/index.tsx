// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import Link from 'next/link'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

import {useProfileContext} from '../context/ProfileContext'
import {ProfileTabKey, profileTabItems} from './ProfileTabItems'

type ProfileTabsProps={
  tab_id: ProfileTabKey,
  isMaintainer: boolean
}

// extract tab items (object keys)
const tabItems = Object.keys(profileTabItems) as ProfileTabKey[]

export default function ProfileTabs({tab_id, isMaintainer}:ProfileTabsProps) {
  const router = useRouter()
  const {software_cnt,project_cnt} = useProfileContext()
  return (
    <Tabs
      variant="scrollable"
      allowScrollButtonsMobile
      value={tab_id}
      aria-label="profile tabs"
    >
      {tabItems.map(key => {
        const item = profileTabItems[key]
        if (item.isVisible({isMaintainer})===true){
          // @ts-expect-error scroll is not present in Tab
          return <Tab
            LinkComponent={Link}
            scroll={false}
            href={`../${router.query['orcid']}/${key}`}
            icon={item.icon}
            key={key}
            label={item.label({
              software_cnt,
              project_cnt
            })}
            value={key}
            sx={{
              '&:hover':{
                color:'text.secondary'
              },
              '&.Mui-selected:hover':{
                color:'primary.main'
              }
            }}
          />
        }
      })}
    </Tabs>
  )
}
