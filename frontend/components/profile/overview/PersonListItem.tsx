// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Avatar from '@mui/material/Avatar'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials} from '~/utils/getDisplayName'
import PersonMetrics from '~/components/cards/SoftwareProjectMetrics'
import ListTitleSubtitle from '~/components/layout/ListTitleSubtitle'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import OverviewListItemLink from '~/components/software/overview/list/OverviewListItemLink'
import {PersonsOverview} from './apiPersonsOverview'

export default function PersonListItem({person}:Readonly<{person:PersonsOverview}>) {
  const given_names = person.display_name.split(' ')[0] ?? ''
  const family_names = person.display_name.split(' ')[1] ?? ''
  const initials = getDisplayInitials({given_names,family_names})
  // combine role and affiliation
  const itemSubtitle = person.role ? `${person.role}, ${person.affiliation}` : person.affiliation

  return (
    <OverviewListItem className="flex-none">
      <OverviewListItemLink
        href={`/persons/${person.account}`}
      >
        <div className="p-2">
          <Avatar
            alt={person.display_name ?? ''}
            src={getImageUrl(person?.avatar_id ?? null) ?? ''}
            sx={{
              width: '3rem',
              height: '3rem',
              fontSize: '1.25rem'
            }}
          >
            {initials}
          </Avatar>
        </div>
        <div className="flex-1 flex flex-col md:flex-row gap-3 py-2">
          {/* basic info */}
          <div className="flex-1">
            <ListTitleSubtitle
              title={person.display_name}
              subtitle={itemSubtitle}
            />
          </div>
          {/* software count */}
          <div className="flex items-center gap-4 mr-4">
            <PersonMetrics
              software_cnt={person.software_cnt ?? 0}
              project_cnt={person.project_cnt ?? 0}
            />
          </div>
        </div>
      </OverviewListItemLink>
    </OverviewListItem>
  )
}
