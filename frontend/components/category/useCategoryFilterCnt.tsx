// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {decodeJsonParam} from '~/utils/extractQueryParam'
import {CategoryFilter} from '../filter/createCategoryFilters'

type UseCategoryFilterCntProps={
  categoryFilters: CategoryFilter[],
  categories_json: string | null,
  // optional base count
  baseCnt?: number
}

/**
 * Count how many category filters are active.
 * All selected categories come in one search string.
 * But these are split into separate filters at the top level (tree top).
 * @param param0
 * @returns
 */
export default function useCategoryFilterCnt({categoryFilters,categories_json,baseCnt=0}:UseCategoryFilterCntProps){

  if (!categoryFilters || categoryFilters?.length===0) return {activeCnt: baseCnt}
  if (categories_json===null) return {activeCnt: baseCnt}
  // convert string to array of filter keys
  const categories= decodeJsonParam(categories_json,[]) as string[]
  // default values
  if (categories.length === 0) return {activeCnt: baseCnt}
  if (categories.length === 1) return {activeCnt: baseCnt + 1}

  // count how many category filters are used
  // let activeCnt = categories.reduce((acc,val)=>{
  //   categoryFilters.forEach((filter)=>{
  //     const found = filter.options.find((option)=>option.category===val)
  //     if (found) acc+=1
  //   })
  //   return acc
  // },0)

  let activeCnt = categoryFilters.reduce((acc,filter)=>{
    // loop categories until first found in the filter
    categories.some((val)=>{
      const found = filter.options.find((option)=>option.category===val)
      // increase active filter cnt
      if (found) {
        acc+=1
        return true
      }
    })
    return acc
  },0)

  if (baseCnt){
    // add base count to activeCnt
    activeCnt+=baseCnt
  }

  return {
    activeCnt,
  }
}
