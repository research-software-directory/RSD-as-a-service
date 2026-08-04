// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import OrgOrderSoftwareBy from './OrgOrderSoftwareBy'
import useOrgSoftwareKeywordsList from './useOrgSoftwareKeywordsList'
import useOrgSoftwareLicensesList from './useOrgSoftwareLicensesList'
import useOrgSoftwareLanguagesList from './useOrgSoftwareLanguagesList'
import useOrgSoftwareCategoriesList from './useOrgSoftwareCategoriesList'
import SharedSoftwareFilters from './SharedSoftwareFilters'

export default function OrgSoftwareFilters() {
  const {keywordsList} = useOrgSoftwareKeywordsList()
  const {languagesList} = useOrgSoftwareLanguagesList()
  const {licensesList} = useOrgSoftwareLicensesList()
  const {categoryFilters} = useOrgSoftwareCategoriesList()

  return (
    <SharedSoftwareFilters
      keywordsList={keywordsList}
      languagesList={languagesList}
      licensesList={licensesList}
      categoryFilters={categoryFilters}
      OrderSoftwareComponent={<OrgOrderSoftwareBy />}
    />
  )
}
