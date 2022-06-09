// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Avatar} from '@mui/material'
import Link from 'next/link'
import {OrganisationForOverview} from '../../types/Organisation'
import {getUrlFromLogoId} from '../../utils/editOrganisation'

export default function OrganisationCard(organisation: OrganisationForOverview) {

  function getCountAndLabel() {
    const count = organisation.software_cnt ?? 0
    let label = 'software packages'
    if (organisation?.software_cnt === 1) label = 'software package'
    return {
      count,
      label
    }
  }

  const {count, label} = getCountAndLabel()

  return (
    <Link
      href={`/organisations/${organisation.slug}`}
      passHref
    >
      <a
        className="h-full"
      >
        <article
          className="flex flex-col border rounded-sm p-4 h-full min-h-[16rem]">
          <h2 className='h-[5rem]'>{organisation.name}</h2>
          <div className="flex flex-1">
            <div className="flex items-center flex-1">
              <Avatar
                alt={organisation.name ?? ''}
                src={getUrlFromLogoId(organisation.logo_id) ?? ''}
                sx={{
                  width: '100%',
                  height: '100%',
                  fontSize: '3rem',
                  '& img': {
                    height: 'auto',
                    maxHeight: '13rem'
                  }
                }}
                variant="square"
              >
                {organisation.name.slice(0,3)}
              </Avatar>
            </div>
             <div className="flex flex-col flex-1 pl-8 py-4">
              <div className="flex-1 flex items-center justify-center text-[4rem] text-primary">
                {count}
              </div>
              <div className="flex items-center justify-center text-center">
                {label}
              </div>
            </div>
          </div>
        </article>
      </a>
    </Link>
  )
}
