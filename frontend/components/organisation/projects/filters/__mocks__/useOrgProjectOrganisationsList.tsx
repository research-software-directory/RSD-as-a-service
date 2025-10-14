// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockOrganisationList from './org_project_participating_organisations_filter.json'

const useOrgProjectOrganisationList=jest.fn(()=>{
  // console.log('useOrgProjectOrganisationList...default mock')
  return {
    organisationList: mockOrganisationList
  }
})

export default useOrgProjectOrganisationList
