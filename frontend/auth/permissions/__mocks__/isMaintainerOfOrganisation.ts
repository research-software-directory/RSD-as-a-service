// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {OrganisationsOfProject} from '~/types/Project'
import {EditOrganisation, OrganisationsForSoftware, OrganisationSource} from '~/types/Organisation'
import {RsdRole} from '~/auth'

type IsOrganisationMaintainerProps = {
  organisation: string
  role?: RsdRole
  account?: string
  token?: string
}

export const isOrganisationMaintainer = jest.fn(async({organisation, role, account, token}: IsOrganisationMaintainerProps)=>{
  // if organisation provided and user role rsd_admin
  if (organisation && role === 'rsd_admin' && account) {
    return true
  }
  return false
})

export const getMaintainerOrganisations = jest.fn(async({token}:
{token?: string})=>Promise.resolve([])
)

type CanEditOrganisationsProps={
  account?: string
  token?: string
  organisations: OrganisationsOfProject[]| OrganisationsForSoftware[]
}

export const canEditOrganisations = jest.fn(({organisations,account,token}:CanEditOrganisationsProps)=>{
  const canEditOrganisations = organisations.map((item, pos) => {
    // extract only needed props
    const org: EditOrganisation = {
      ...item,
      // additional props for edit type
      position: pos + 1,
      logo_b64: null,
      logo_mime_type: null,
      source: 'RSD' as OrganisationSource,
      status: item.status,
      // false by default
      canEdit: false
    }
    return org
  })
  return Promise.resolve(canEditOrganisations)
})
