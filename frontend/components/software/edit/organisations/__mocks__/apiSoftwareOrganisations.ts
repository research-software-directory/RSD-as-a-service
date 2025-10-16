// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {canEditOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'
import {getOrganisationsForSoftware} from '~/components/organisation/apiEditOrganisation'


export type UseParticipatingOrganisationsProps = {
  software: string,
  token: string,
  account: string
}

export async function getParticipatingOrganisationsForSoftware({software, token, account}: UseParticipatingOrganisationsProps) {
  const resp = await getOrganisationsForSoftware({
    software,
    token
  })
  // convert to EditOrganisation type and add canEdit flag
  const organisations = await canEditOrganisations({
    organisations: resp,
    account,
    token
  })
  // debugger
  return organisations
}


export async function removeOrganisationCategoriesFromSoftware(
  softwareId: string,
  organisationId: string,
  token: string
){
  return {status:200}
}
