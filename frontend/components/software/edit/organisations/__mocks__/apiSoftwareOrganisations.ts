// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import mockSoftwareOfOrganisation from './organisationsOfSoftware.json'
import {OrganisationSource} from '~/types/Organisation'

export type UseParticipatingOrganisationsProps = {
  software: string,
  token: string,
  account: string
}

export const getParticipatingOrganisationsForSoftware=jest.fn(async(
  {software, token, account}: UseParticipatingOrganisationsProps
)=>{
  // console.log('getParticipatingOrganisationsForSoftware...MOCK')
  // const organisations = mockSoftwareOfOrganisation.map((item,pos)=>{
  //   return {
  //     ...item,
  //     // additional props for edit type
  //     position: pos + 1,
  //     logo_b64: null,
  //     logo_mime_type: null,
  //     source: 'RSD' as OrganisationSource,
  //     status: item.status,
  //     // false by default
  //     canEdit: false
  //   }
  // })
  // // debugger
  // return organisations
  return []
})


export const removeOrganisationCategoriesFromSoftware=jest.fn((
  softwareId: string,
  organisationId: string,
  token: string
)=>{
  return {status:200}
})
