// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {ProjectOrganisationProps} from '~/types/Organisation'
import ProjectSidebarTitle from '~/components/layout/SidebarTitle'
import ProjectSidebarSection from '../layout/SidebarSection'


export function FundedUnder({grant_id}:{grant_id:string|null}){

  if (!grant_id) return null

  return (
    <ProjectSidebarSection>
      <ProjectSidebarTitle>Funded under</ProjectSidebarTitle>
      <div className="text-sm">Grant ID: {grant_id}</div>
    </ProjectSidebarSection>
  )
}

export function FundedBy({fundingOrganisations}:{fundingOrganisations:ProjectOrganisationProps[]}){

  if (!fundingOrganisations || fundingOrganisations.length===0) return null

  return (
    <ProjectSidebarSection>
      <ProjectSidebarTitle>Funded by</ProjectSidebarTitle>
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
    </ProjectSidebarSection>
  )
}

