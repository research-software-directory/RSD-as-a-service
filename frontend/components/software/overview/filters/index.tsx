// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import FilterHeader from '~/components/filter/FilterHeader'
import KeywordsFilter, {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import ProgrammingLanguagesFilter, {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import LicensesFilter, {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import RsdSourceFilter, {HostsFilterOption} from '~/components/filter/RsdHostFilter'
import CategoriesFilter, {CategoryOption} from '~/components/filter/CategoriesFilter'
import useSoftwareOverviewParams from '../useSoftwareOverviewParams'
import OrderSoftwareBy, {OrderHighlightsBy} from './OrderSoftwareBy'
import useHasCategories from './useHasCategories'

type SoftwareFilterProps = {
  keywords: string[]
  keywordsList: KeywordFilterOption[]
  languages: string[]
  languagesList: LanguagesFilterOption[]
  licenses: string[]
  licensesList: LicensesFilterOption[]
  categories: string[]
  categoryList: CategoryOption[]
  orderBy: string,
  filterCnt: number,
  highlightsOnly?: boolean
  rsd_host?: string
  hostsList?: HostsFilterOption[]
  hasRemotes?: boolean
}

export default function SoftwareFilters({
  keywords, keywordsList,
  languages, languagesList,
  licenses, licensesList,
  categories, categoryList,
  rsd_host, hostsList,
  filterCnt, orderBy,
  highlightsOnly = false,
  hasRemotes = false
}:SoftwareFilterProps) {
  const {resetFilters,handleQueryChange} = useSoftwareOverviewParams()
  const hasCategories = useHasCategories()

  // console.group('SoftwareFilters')
  // console.log('hasCategories...', hasCategories)
  // console.log('categoryList...', categoryList)
  // console.groupEnd()

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
      {highlightsOnly ?
        <OrderHighlightsBy orderBy={orderBy} />
        :
        <OrderSoftwareBy orderBy={orderBy} />
      }
      {/* Keywords */}
      <div>
        <KeywordsFilter
          keywords={keywords}
          keywordsList={keywordsList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Programming Languages */}
      <div>
        <ProgrammingLanguagesFilter
          prog_lang={languages}
          languagesList={languagesList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Licenses */}
      <div>
        <LicensesFilter
          licenses={licenses}
          licensesList={licensesList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Custom categories */}
      {hasCategories ?
        <div>
          <CategoriesFilter
            title="Categories"
            categories={categories}
            categoryList={categoryList}
            handleQueryChange={handleQueryChange}
          />
        </div>
        : null
      }
      {/* RSD hosts list only if remotes are defined */}
      {hasRemotes ?
        <RsdSourceFilter
          rsd_host={rsd_host}
          hostsList={hostsList ?? []}
          handleQueryChange={handleQueryChange}
        />
        : null
      }
    </>
  )
}
