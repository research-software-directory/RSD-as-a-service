// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
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
      data-testid="organisation-card-link"
      href={`/organisations/${organisation.rsd_path}`}
      className="h-full relative"
      passHref
    >
      <article className="flex flex-col border h-full min-h-[16rem] overflow-hidden">
        <div className="pl-8 pt-8 flex">
          <CardTitle
            title={organisation.name}
            className={`${organisation.is_tenant ? 'mr-[5rem]' : 'mr-[2rem]' }`}
          >
            {organisation.name}
          </CardTitle>
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
        <div className="flex-1 grid gap-8 lg:grid-cols-[1fr,1fr] p-8 overflow-hidden">
          <LogoAvatar
            name={organisation.name ?? ''}
            src={getImageUrl(organisation.logo_id) ?? undefined}
            sx={{
              fontSize: '4rem',
              '& img': {
                objectFit: 'contain',
                minHeight: '4rem',
                minWidth: '4rem'
              }
            }}
          />
          <div className="flex-1 flex gap-8 justify-center items-end">
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
