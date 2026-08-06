// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {CategoryEntry} from '~/types/Category'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import SharedSoftwareFilters from '~/components/organisation/software/filters/SharedSoftwareFilters'
import OrderCommunitySoftwareBy from './OrderCommunitySoftwareBy'
import useComSoftwareCategoriesList from './useComSoftwareCategoriesList'

type CommunitySoftwareFiltersProps = {
  keywordsList: KeywordFilterOption[]
  languagesList: LanguagesFilterOption[]
  licensesList: LicensesFilterOption[]
  categoryList: CategoryOption[]
  categoryEntry: CategoryEntry[]
}

export default function CommunitySoftwareFilters({
  keywordsList,languagesList,licensesList,categoryList,categoryEntry
}:CommunitySoftwareFiltersProps) {
  // split category tree into separate filters
  const {categoryFilters} = useComSoftwareCategoriesList({categoryList,categoryEntry})

  return (
    <SharedSoftwareFilters
      keywordsList={keywordsList}
      languagesList={languagesList}
      licensesList={licensesList}
      categoryFilters={categoryFilters}
      OrderSoftwareComponent={<OrderCommunitySoftwareBy />}
    />
  )
}
