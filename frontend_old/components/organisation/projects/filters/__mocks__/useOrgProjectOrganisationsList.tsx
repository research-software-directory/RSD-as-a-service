// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockOrganisationList from './org_project_participating_organisations_filter.json'

export default function useOrgProjectOrganisationList() {
  // console.log('useOrgProjectOrganisationList...default mock')
  return {
    organisationList: mockOrganisationList
  }
}
