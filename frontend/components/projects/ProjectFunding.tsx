// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ProjectOrganisationProps} from '~/types/Organisation'

export default function ProjectFunding({grant_id, fundingOrganisations=[]}:
  { grant_id: string | null, fundingOrganisations:ProjectOrganisationProps[] }) {

  function renderFundedUnder() {
    if (grant_id) {
      return (
        <>
          <h4 className="text-primary py-4">Funded under</h4>
          <div className="text-sm">Grant ID: {grant_id}</div>
        </>
      )
    }
    return null
  }

  function renderFundedBy() {
    if (fundingOrganisations && fundingOrganisations.length > 0) {
      return (
        <>
          <h4 className="text-primary py-4">Funded by</h4>
          <ul>
          {fundingOrganisations.map(item => {
            const link = `/organisations/${item.slug}`
            return (
              <Link
                key={link}
                href={link}
                passHref
              >
                <a target="_blank">
                  <li className="text-sm py-1">
                    {item.name}
                  </li>
                </a>
              </Link>
              )
          })}
          </ul>
        </>
      )
    }
    return null
  }

  return (
    <div>
      {renderFundedUnder()}
      {renderFundedBy()}
    </div>
  )
}
