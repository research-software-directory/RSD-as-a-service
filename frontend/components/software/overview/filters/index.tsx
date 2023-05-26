// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/layout/filter/FilterHeader'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import OrderSoftwareBy from './OrderSoftwareBy'
import SoftwareKeywordsFilter from './SoftwareKeywordsFilter'
import ProgrammingLanguagesFilter from './ProgrammingLanguagesFilter'
import LicensesFilter from './LicensesFilter'
import {KeywordFilterOption, LanguagesFilterOption,LicensesFilterOption} from './softwareFiltersApi'

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
    if (orderBy) return false
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
      <ProgrammingLanguagesFilter
        prog_lang={languages}
        languagesList={languagesList}
      />
      {/* Licenses */}
      <LicensesFilter
        licenses={licenses}
        licensesList={licensesList}
      />
    </>
  )
}
