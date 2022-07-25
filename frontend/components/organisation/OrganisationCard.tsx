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
      <a
        className="h-full relative"
      >
        <article
          className="flex flex-col border h-full min-h-[16rem] overflow-hidden">
          {/* <h2 className='h-[5rem]'>{organisation.name}</h2> */}
          <div className="pl-8 flex">
            <SingleLineTitle
              title={organisation.name}
              sx={{
                padding: '1.5rem 0rem',
                // place for verified
                margin: organisation.is_tenant ? '0rem 6rem 0rem 0rem' : '0rem 2rem 0rem 0rem',
              }}
            >
              {organisation.name}
            </SingleLineTitle>
            {
              organisation.is_tenant && <VerifiedIcon
                sx={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '0.75rem',
                  width: '4rem',
                  height: '4rem',
                  opacity: 0.4,
                  color: 'primary.main'
                }}
              />
            }
          </div>
          <div className="flex-1 flex md:grid md:grid-cols-[3fr,2fr] px-8 pb-4 overflow-hidden">
            <div className="hidden md:block">
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
              <StatCounter
                label={label}
                value={count}
              />
              <StatCounter
                label={'research projects'}
                value={organisation.project_cnt ?? 0}
              />
            </div>
          </div>
        </article>
      </a>
    </Link>
  )
}
