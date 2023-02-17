// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
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
          <div className="text-primary py-4">Funded under</div>
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
          <div className="text-primary py-4">Funded by</div>
          <ul>
          {fundingOrganisations.map(item => {
            const link = `/organisations/${item.rsd_path}`
            return (
              <li key={link} className="text-sm py-1">
                <Link
                  href={link}
                  target="_self"
                  passHref
                >
                  {item.name}
                </Link>
              </li>
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
