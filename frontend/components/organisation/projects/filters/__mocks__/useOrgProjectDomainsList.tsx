// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockDomainsList from './mockProjectDomainsList.json'

const useOrgProjectDomainsFilter=jest.fn(()=>{
  // console.log('useOrgProjectDomainsFilter...default mock')
  return {
    domainsList: mockDomainsList
  }
})

export default useOrgProjectDomainsFilter
