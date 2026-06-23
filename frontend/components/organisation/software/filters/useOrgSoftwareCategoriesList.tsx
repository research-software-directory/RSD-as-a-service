// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {categoryEntriesToRoots, loadCategoryEntry} from '~/components/category/apiCategories'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import {addCountToEntryProps, CategoryFilter, categoryFiltersFromTree} from '~/components/filter/createCategoryFilters'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import useSoftwareParams from './useSoftwareParams'
import {buildOrgSoftwareFilter, OrgSoftwareFilterProps} from './useOrgSoftwareKeywordsList'

async function orgSoftwareCategoriesFilter({token,...params}:OrgSoftwareFilterProps){
  try {
    const query = 'rpc/org_software_categories_filter?order=category_cnt.desc,category'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildOrgSoftwareFilter(params)

    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      // we pass params in the body of POST
      body: JSON.stringify(filter)
    })

    if (resp.status === 200) {
      const json: CategoryOption[] = await resp.json()
      return json
    }

    logger(`orgSoftwareCategoriesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgSoftwareCategoriesFilter: ${e?.message}`, 'error')
    return []
  }
}

export default function useOrgSoftwareCategoriesList(){
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {
    search,keywords_json,prog_lang_json,licenses_json,categories_json
  } = useSoftwareParams()
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([])

  useEffect(()=>{
    let abort = false

    if (id) {
      const keywords = decodeJsonParam(keywords_json,null)
      const prog_lang = decodeJsonParam(prog_lang_json, null)
      const licenses = decodeJsonParam(licenses_json, null)
      const categories = decodeJsonParam(categories_json, null)

      // get filter options
      Promise.all([
        orgSoftwareCategoriesFilter({
          id,
          search,
          keywords,
          prog_lang,
          licenses,
          categories,
          token
        }),
        loadCategoryEntry({
          organisation: id,
          allow_software: true
        })
      ]).then(([list,entries])=>{
        // add category count to entry properties
        addCountToEntryProps({
          categoryList: list,
          categoryEntry: entries
        })
        // convert list to tree
        const categoryTree = categoryEntriesToRoots(entries)
        // convert tree to category filters
        const categoryFilters = categoryFiltersFromTree({
          nodes: categoryTree,
          level: 0
        })
        if (abort) return
        setCategoryFilters(categoryFilters as CategoryFilter[])
      }).catch(err=>{
        setCategoryFilters([])
        logger(`useOrgSoftwareCategoriesList: ${err}`,'error')
      })
    }

    return ()=>{abort=true}
  },[
    search, keywords_json,
    prog_lang_json, licenses_json,
    categories_json,
    id, token
  ])

  return {
    categoryFilters
  }

}
