// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {OrganisationForOverview} from '../../types/Organisation'
import {getUrlFromLogoId} from '../../utils/editOrganisation'
import StatCounter from '../layout/StatCounter'
import VerifiedIcon from '@mui/icons-material/Verified'
import SingleLineTitle from '../layout/SingleLineTitle'
import LogoAvatar from '../layout/LogoAvatar'
import {Tooltip} from '@mui/material'

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
      href={`/organisations/${organisation.rsd_path}`}
      passHref
    >
      <a className="h-full flex flex-col border h-full min-h-[16rem] overflow-hidden p-4 ">
        <div className="flex">
          <h2 className='flex-1 line-clamp-2'>{organisation.name}</h2>
          {organisation.is_tenant && <Tooltip title="Verified organisation">
            <div><VerifiedIcon className="w-12 opacity-50 text-primary"/></div>
          </Tooltip>}
        </div>
        <div className="flex-1 flex overflow-hidden">
          <div className="">
            <LogoAvatar
              name={organisation.name ?? ''}
              src={getUrlFromLogoId(organisation.logo_id) ?? undefined}
              sx={{
                '& img': {
                  height: 'auto',
                  maxHeight: '10rem',
                  width: 'auto',
                  maxWidth: '100%'
                }
              }}
            />
          </div>
          <div className="flex-1 flex justify-center items-center md:justify-end pl-4">
            <StatCounter label={label} value={count}/>
            <StatCounter label={'research projects'} value={organisation.project_cnt ?? 0}/>
          </div>
        </div>
      </a>
    </Link>
  )
}
