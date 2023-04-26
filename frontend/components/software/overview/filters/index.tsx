// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// TODO! examine what can be removed
import {Keyword} from '~/components/keyword/FindKeyword'
import {ProgrammingLanguage} from '../../filter/softwareFilterApi'
import FilterHeader from './FilterHeader'
import OrderBy from './OrderBy'
import KeywordsFilter from './KeywordsFilter'
import ProgrammingLanguagesFilter from './ProgrammingLanguagesFilter'
import LicensesFilter from './LicensesFilter'
import {KeywordFilterOption, LanguagesFilterOption,LicensesFilterOption} from './softwareFiltersApi'

export type LicenseWithCount = {
  license: string;
  cnt: number;
}

type SoftwareFilterPanelProps = {
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  languages: string[]
  languagesList: LanguagesFilterOption[]
  licenses: string[]
  licensesList: LicensesFilterOption[]
  orderBy: string,
  filterCnt: number,
  resetFilters: () => void
  handleQueryChange: (key: string, value: string | string[]) => void
}

export default function SoftwareFilters({
  keywords,
  keywordsList,
  languages,
  languagesList,
  licenses,
  licensesList,
  filterCnt,
  handleQueryChange,
  orderBy,
  resetFilters
}:SoftwareFilterPanelProps) {

  return (
    <>
      <FilterHeader
        filterCnt={filterCnt}
        resetFilters={resetFilters}
      />
      {/* Order by */}
      <OrderBy
        orderBy={orderBy}
        handleQueryChange={handleQueryChange}
      />
      {/* Keywords */}
      <KeywordsFilter
        keywords={keywords}
        keywordsList={keywordsList}
        handleQueryChange={handleQueryChange}
      />
      {/* Programme Languages */}
      <ProgrammingLanguagesFilter
        prog_lang={languages}
        languagesList={languagesList}
        handleQueryChange={handleQueryChange}
      />
      {/* Licenses */}
      <LicensesFilter
        licenses={licenses}
        licensesList={licensesList}
        handleQueryChange={handleQueryChange}
      />
    </>
  )
}
