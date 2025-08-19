// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Avatar from '@mui/material/Avatar'

import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials} from '~/utils/getDisplayName'
import PersonMetrics from '~/components/cards/SoftwareProjectMetrics'
import OverviewListItem from '~/components/software/overview/list/OverviewListItem'
import {PersonsOverview} from './apiPersonsOverview'

export default function CommunityListItem({person}:{person:PersonsOverview}) {
  const given_names = person.display_name.split(' ')[0] ?? ''
  const family_names = person.display_name.split(' ')[1] ?? ''
  const initials = getDisplayInitials({given_names,family_names})

  return (
    <OverviewListItem className="flex-none">
      <Link
        data-testid="community-list-item"
        key={person.account}
        href={`/persons/${person.account}`}
        className='flex-1 flex items-center hover:text-inherit bg-base-100 rounded-xs'
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
            <div className='line-clamp-2 md:line-clamp-1 break-words font-medium'>
              {person.display_name}
            </div>
            <div className='line-clamp-4 md:line-clamp-2 break-words text-sm opacity-70'>
              {person.role ? `${person.role},` : null} {person.affiliation}
            </div>
          </div>
          {/* software count */}
          <div className="flex items-center gap-4 mr-4">
            <PersonMetrics
              software_cnt={person.software_cnt ?? 0}
              project_cnt={person.project_cnt ?? 0}
            />
          </div>
        </div>
      </Link>
    </OverviewListItem>
  )
}
