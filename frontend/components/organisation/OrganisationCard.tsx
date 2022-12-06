// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {OrganisationForOverview} from '../../types/Organisation'
import {getImageUrl} from '~/utils/editImage'
import StatCounter from '../layout/StatCounter'
import VerifiedIcon from '@mui/icons-material/Verified'
import LogoAvatar from '../layout/LogoAvatar'
import CardTitle from '../layout/CardTitle'

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
      className="h-full relative"
      passHref
    >
      <article
        className="flex flex-col border h-full min-h-[16rem] overflow-hidden">
        {/* <h2 className='h-[5rem]'>{organisation.name}</h2> */}
        <div className="pl-8 pt-8 flex">
          <CardTitle
            title={organisation.name}
            className={`${organisation.is_tenant ? 'mr-[5rem]' : 'mr-[2rem]' }`}
          >
            {organisation.name}
          </CardTitle>
          {/* <SingleLineTitle
            title={organisation.name}
            sx={{
              padding: '1.5rem 0rem',
              // place for verified
              margin: organisation.is_tenant ? '0rem 6rem 0rem 0rem' : '0rem 2rem 0rem 0rem',
            }}
          >
            {organisation.name}
          </SingleLineTitle> */}
          {
            organisation.is_tenant && <span title="Officially registered organisation">
              <VerifiedIcon
                sx={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  width: '4rem',
                  height: '4rem',
                  opacity: 0.4,
                  color: 'primary.main'
                }}
            /></span>
          }
        </div>
        <div className="flex-1 grid gap-8 lg:grid-cols-[2fr,3fr] p-8 overflow-hidden">
          <LogoAvatar
            name={organisation.name ?? ''}
            src={getImageUrl(organisation.logo_id) ?? undefined}
            sx={{
              // remove line-height=1
              lineHeight: 'inherit',
              fontSize: '4rem',
              '& img': {
                height: 'auto',
                // maxHeight: '10rem',
                width: 'auto',
                maxWidth: '100%'
              }
            }}
          />
          <div className="flex-1 flex gap-4 justify-between items-center">
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
    </Link>
  )
}
