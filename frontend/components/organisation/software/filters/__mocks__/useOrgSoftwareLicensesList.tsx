// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockLicensesList from './org_software_licenses_filter.json'

export default function useOrgSoftwareLicensesList() {
  // console.log('useOrgSoftwareLicensesList...default mock')
  return {
    licensesList: mockLicensesList
  }
}
