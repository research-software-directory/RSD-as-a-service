// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Avatar from '@mui/material/Avatar'

import LogoOrcid from '~/assets/logos/logo-orcid.svg'
import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials} from '~/utils/getDisplayName'
import CardImageFrame from '~/components/cards/CardImageFrame'
import CardContentFrame from '~/components/cards/CardContentFrame'
import KeywordList from '~/components/cards/KeywordList'
import SoftwareProjectMetrics from '~/components/cards/SoftwareProjectMetrics'
import {PersonsOverview} from './apiPersonsOverview'

export default function PersonCard({person}:{person:PersonsOverview}) {
  const given_names = person.display_name.split(' ')[0] ?? ''
  const family_names = person.display_name.split(' ')[1] ?? ''
  const initials = getDisplayInitials({given_names,family_names})
  return (
    <Link
      data-testid="person-card-link"
      href={`/persons/${person.account}`}
      className="flex h-full hover:text-inherit"
      passHref
    >
      <div className="flex flex-col transition overflow-hidden bg-base-100 shadow-md hover:shadow-lg rounded-lg hover:cursor-pointer select-none w-full relative">
        <CardImageFrame>
          <div className="flex-1 flex pt-4 px-4">
            <Avatar
              alt={person.display_name ?? ''}
              src={getImageUrl(person?.avatar_id ?? null) ?? ''}
              sx={{
                width: '8rem',
                height: '8rem',
                fontSize: '3.25rem'
              }}
            >
              {initials}
            </Avatar>
          </div>
        </CardImageFrame>
        <CardContentFrame>
          {/* personal info  */}
          <h2
            title={person.display_name}
            className="text-xl font-medium line-clamp-1 my-1"
          >
            {person.display_name}
          </h2>
          <div className="grid gap-2">
            {person?.role ? <div>{person.role}</div> : null}
            {person?.affiliation ? <div>{person?.affiliation}</div>:null}
            {person?.orcid ? <div>
              <LogoOrcid className="inline max-w-[1.125rem] mr-1" />
              <span className="text-sm align-bottom">{person.orcid}</span>
            </div>: null}
          </div>
          {/* keywords */}
          <div className="flex-1 overflow-auto py-2">
            <KeywordList
              keywords={person.keywords}
            />
          </div>
          {/* metrics */}
          <div className="flex gap-4 justify-end text-center">
            <SoftwareProjectMetrics
              software_cnt={person.software_cnt ?? 0}
              project_cnt={person.project_cnt ?? 0}
            />
          </div>
        </CardContentFrame>
      </div>
    </Link>
  )
}
