// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Marc Hanisch (GFZ) <marc.hanisch@gfz-potsdam.de>
//
// SPDX-License-Identifier: EUPL-1.2

import {getUrlFromLogoId} from '~/utils/editOrganisation'

import Link from 'next/link'
import {OrganisationForOverview} from '~/types/Organisation'

/* eslint-disable @next/next/no-img-element */

export default function HorizontalScrollContainer(
{organisations}: {organisations: OrganisationForOverview[]}
) {
  return (
    <div
      style={{
        display: 'flex',
        height: '200px'
      }}
    >
      {
        organisations.map(item => {
          return(
            <Link
              key={`link_${item.name}`}
              href={`/organisations/${item.rsd_path}`}
              passHref
              >
              <img
                alt={item.name}
                src={getUrlFromLogoId(item.logo_id) ?? undefined}
                className="p-10 hover:cursor-pointer"
                style = {{
                  width: 'auto',
                  objectFit: 'contain',
                  aspectRatio: 'auto'
                }}
              />
            </Link>
          )
        })
      }
    </div>
  )
}
