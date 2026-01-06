// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {EditOrganisation, OrganisationStatus, SoftwareForOrganisation} from '~/types/Organisation'

export const createOrganisationAndAddToSoftware=jest.fn(async({item, token, software}:
{item: EditOrganisation, token: string, software: string})=>{

  item.id = 'test-uuid'

  if (item.id) {
    // add this organisation to software
    const resp = await addOrganisationToSoftware({
      software,
      organisation: item.id,
      position: item.position,
      token
    })
    if (resp.status === 200) {
      // we receive assigned status in message
      item.status = resp.message as OrganisationStatus
      // return updated item
      return {
        status: 200,
        message: item
      }
    }
    // debugger
    return resp
  } else {
    return {
      status: 400,
      message: 'Organisation id is missing.'
    }
  }
})

export const addOrganisationToSoftware=jest.fn(async({software, organisation, position, token}:
{software: string, organisation: string, position: number | null, token: string})=>{
  // 2a. determine status - default is approved
  const status: SoftwareForOrganisation['status'] = 'approved'
  // return status assigned to organisation
  return {
    status: 200,
    message: status
  }
})

export const patchOrganisationPositions=jest.fn(async({software, organisations, token}:
{software: string, organisations: EditOrganisation[], token: string})=>{
  if (organisations.length === 0) return {
    status: 400,
    message: 'Empty organisations array'
  }
  // OK by default
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteOrganisationFromSoftware=jest.fn(async({software, organisation, token}:
{software: string | undefined, organisation: string, token: string})=>{
  if (typeof software == 'undefined') {
    return {
      status: 400,
      message: 'Bad request. software id undefined'
    }
  }
  // OK by default
  return {
    status: 200,
    message: 'OK'
  }
})
