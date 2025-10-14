// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import mockSoftwareOfOrganisation from './organisationsOfSoftware.json'
import {
  UseParticipatingOrganisationsProps
} from './apiSoftwareOrganisations'
import {OrganisationSource} from '~/types/Organisation'

export const useParticipatingOrganisations=jest.fn(({software, token, account}: UseParticipatingOrganisationsProps)=>{
  const organisations = mockSoftwareOfOrganisation.map((item,pos)=>{
    return {
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
  })
  return {
    loading:false,
    organisations,
    setOrganisations:jest.fn
  }
})

export default useParticipatingOrganisations
