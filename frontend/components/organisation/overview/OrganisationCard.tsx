// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {getImageUrl} from '~/utils/editImage'

export type OrganisationCardProps = {
  id: string,
  name: string,
  is_tenant: boolean,
  rsd_path: string,
  logo_id: string | null
  software_cnt: number | null
  project_cnt: number | null
}

export default function OrganisationCard({organisation}: { organisation: OrganisationCardProps }) {

  return (
    <Link
      data-testid="organisation-card-link"
      href={`/organisations/${organisation.rsd_path}`}
      className="flex h-full hover:text-inherit"
      passHref
    >
      {/* Organization card content */}
      <div className="transition bg-base-100 shadow-md hover:shadow-lg
                      rounded-lg hover:cursor-pointer select-none w-full p-4">

        <img
          className="object-contain mx-auto h-[150px] rounded"
          src={getImageUrl(organisation.logo_id) ?? undefined}
          alt={`Cover image for ${organisation.name}`}
        />

        <h2 className="mt-5 text-xl font-medium mb-2 line-clamp-2 min-h-[60px]">
          {organisation.name}
        </h2>

        {/* {
          //  Organization tenant, hidden until we have a beeter use case
            organisation.is_tenant && <span title="Officially registered organisation">
              <VerifiedIcon
                sx={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '0.5rem',
                  width: '1rem',
                  height: '1rem',
                  opacity: 0.4,
                  color: 'primary.main'
                }}
              /></span>
          } */}

        <div className="flex gap-8 items-end text-center mb-2">

          {/* Counter */}
          <div>
            <div className='text-5xl font-light'>
              {organisation.software_cnt ?? 0}
            </div>
            <div className='text-center text-sm'>
              software <br />package{(organisation?.software_cnt === 1) ? '' : 's'}
            </div>
          </div>

          {/* Counter */}
          <div>
            <div className='text-5xl font-light'>
              {organisation.project_cnt ?? 0}
            </div>
            <div className='text-center text-sm'>
              research <br />project{(organisation?.software_cnt === 1) ? '' : 's'}
            </div>
          </div>

        </div>
      </div>
    </Link>
  )
}
