// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {CategoryEntry} from '~/types/Category'
import {categoryEntriesToRoots} from '~/components/category/apiCategories'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import {addCountToEntryProps, CategoryFilter, categoryFiltersFromTree, sortFiltersAndOptionsByName} from '~/components/filter/createCategoryFilters'

export default function useComSoftwareCategoriesList({
  categoryList, categoryEntry
}:{
  categoryList:CategoryOption[], categoryEntry: CategoryEntry[]
}){

  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([])

  useEffect(()=>{
    let abort = false

    if (categoryList.length > 0 && categoryEntry.length>0) {

      // add category count to entry properties
      addCountToEntryProps({
        categoryList,
        categoryEntry
      })
      // convert list to tree
      const categoryTree = categoryEntriesToRoots(categoryEntry)
      // convert tree to category filters
      const categoryFilters = categoryFiltersFromTree({
        nodes: categoryTree,
        level: 0
      }) as CategoryFilter[]
      // sort filter options by name
      sortFiltersAndOptionsByName(categoryFilters)
      if (abort) return
      setCategoryFilters(categoryFilters)
    }
    return ()=>{abort=true}
  },[categoryList,categoryEntry])

  return {
    categoryFilters
  }
}
