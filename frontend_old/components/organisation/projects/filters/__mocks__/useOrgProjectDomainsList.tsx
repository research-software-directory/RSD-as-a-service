// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockDomainsList from './mockProjectDomainsList.json'

export default function useOrgProjectDomainsFilter() {
  // console.log('useOrgProjectDomainsFilter...default mock')
  return {
    domainsList: mockDomainsList
  }

}
