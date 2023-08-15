// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import OrderSoftwareBy from './OrderSoftwareBy'
import SoftwareKeywordsFilter from './SoftwareKeywordsFilter'
import SoftwareLanguagesFilter from './SoftwareLanguagesFilter'
import SoftwareLicensesFilter from './SoftwareLicensesFilter'

export type LicenseWithCount = {
  license: string;
  cnt: number;
}

type SoftwareFilterProps = {
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  languages: string[]
  languagesList: LanguagesFilterOption[]
  licenses: string[]
  licensesList: LicensesFilterOption[]
  orderBy: string,
  filterCnt: number
}

export default function SoftwareFilters({
  keywords,
  keywordsList,
  languages,
  languagesList,
  licenses,
  licensesList,
  filterCnt,
  orderBy
}:SoftwareFilterProps) {
  const {resetFilters} = useSoftwareOverviewParams()

  function clearDisabled() {
    if (filterCnt && filterCnt > 0) return false
    return true
  }

  return (
    <>
      <FilterHeader
        filterCnt={filterCnt}
        disableClear={clearDisabled()}
        resetFilters={resetFilters}
      />
      {/* Order by */}
      <OrderSoftwareBy
        orderBy={orderBy}
      />
      {/* Keywords */}
      <SoftwareKeywordsFilter
        keywords={keywords}
        keywordsList={keywordsList}
      />
      {/* Programme Languages */}
      <SoftwareLanguagesFilter
        prog_lang={languages}
        languagesList={languagesList}
      />
      {/* Licenses */}
      <SoftwareLicensesFilter
        licenses={licenses}
        licensesList={licensesList}
      />
    </>
  )
}
