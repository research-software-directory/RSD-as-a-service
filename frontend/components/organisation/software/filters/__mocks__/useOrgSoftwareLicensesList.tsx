// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockLicensesList from './org_software_licenses_filter.json'

const useOrgSoftwareLicensesList=jest.fn(()=>{
  // console.log('useOrgSoftwareLicensesList...default mock')
  return {
    licensesList: mockLicensesList
  }
})

export default useOrgSoftwareLicensesList
