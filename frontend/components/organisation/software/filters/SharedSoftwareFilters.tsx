// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'

import {decodeJsonParam} from '~/utils/extractQueryParam'
import CategoriesFilter from '~/components/filter/CategoriesFilter'
import {CategoryFilter} from '~/components/filter/createCategoryFilters'
import KeywordsFilter, {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import LicensesFilter, {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import ProgrammingLanguagesFilter, {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import FilterHeader from '~/components/filter/FilterHeader'
import useCategoryFilterCnt from '~/components/category/useCategoryFilterCnt'
import useQueryChange from '~/components/organisation/projects/useQueryChange'
import useSoftwareParams from './useSoftwareParams'

type DefaultSoftwareFiltersProps=Readonly<{
  keywordsList: KeywordFilterOption[]
  languagesList: LanguagesFilterOption[]
  licensesList: LicensesFilterOption[]
  categoryFilters: CategoryFilter[]
  OrderSoftwareComponent?: JSX.Element
}>

export default function SharedSoftwareFilters({
  keywordsList, languagesList,
  licensesList, categoryFilters,
  OrderSoftwareComponent
}:DefaultSoftwareFiltersProps){
  const {resetFilters,handleQueryChange} = useQueryChange()
  const {
    filterCnt,keywords_json,prog_lang_json,
    licenses_json, categories_json
  } = useSoftwareParams()
  // include separate categories filters to total filter count
  const {activeCnt:totFilterCnt} = useCategoryFilterCnt({
    categoryFilters,
    categories_json,
    // provide base count without categories_json
    baseCnt: categories_json ? filterCnt - 1 : filterCnt
  })

  // decode query params
  const keywords = decodeJsonParam(keywords_json, [])
  const prog_lang = decodeJsonParam(prog_lang_json, [])
  const licenses= decodeJsonParam(licenses_json,[])
  const categories= decodeJsonParam(categories_json,[])

  // console.group('SharedSoftwareFilters')
  // console.log('filterCnt...', filterCnt)
  // console.log('totFilterCnt...', totFilterCnt)
  // console.log('keywordsList...', keywordsList)
  // console.log('languagesList...', languagesList)
  // console.log('licensesList...', licensesList)
  // console.log('categoryFilters...', categoryFilters)
  // console.groupEnd()

  function clearDisabled() {
    if (totFilterCnt && totFilterCnt > 0) return false
    return true
  }

  return (
    <>
      <FilterHeader
        filterCnt={totFilterCnt}
        disableClear={clearDisabled()}
        resetFilters={()=>resetFilters('software')}
      />
      {/* Order by */}
      {OrderSoftwareComponent}
      {/* Keywords */}
      <div>
        <KeywordsFilter
          keywords={keywords}
          keywordsList={keywordsList}
          handleQueryChange={handleQueryChange}
        />
      </div>
      {/* Program languages */}
      <div>
        <ProgrammingLanguagesFilter
          prog_lang={prog_lang}
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
      {/* Custom organisation categories */}
      {categoryFilters.map(filter=>
        <div key={filter?.short_name}>
          <CategoriesFilter
            title={filter?.short_name}
            categories={categories}
            categoryList={filter.options}
            handleQueryChange={handleQueryChange}
          />
        </div>
      )}
    </>
  )
}
