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
import useProjectParams from '~/components/projects/overview/useProjectParams'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import {buildOrgProjectFilter, OrgProjectFilterProps} from './useOrgProjectKeywordsList'

async function orgProjectCategoriesFilter({token,...params}:OrgProjectFilterProps){
  try {
    const query = 'rpc/org_project_categories_filter?order=category_cnt.desc,category'
    const url = `${getBaseUrl()}/${query}`
    const filter = buildOrgProjectFilter(params)

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

    logger(`orgProjectCategoriesFilter: ${resp.status} ${resp.statusText}`, 'warn')
    return []

  } catch (e: any) {
    logger(`orgProjectCategoriesFilter: ${e?.message}`, 'error')
    return []
  }
}

export default function useOrgProjectCategoriesList(){
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const {
    search,project_status,keywords_json,
    domains_json,organisations_json,categories_json
  } = useProjectParams()
  const [categoryFilters, setCategoryFilters] = useState<CategoryFilter[]>([])

  useEffect(()=>{
    let abort = false

    if (id) {
      const keywords = decodeJsonParam(keywords_json, null)
      const domains = decodeJsonParam(domains_json, null)
      const organisations = decodeJsonParam(organisations_json, null)
      const categories = decodeJsonParam(categories_json, null)

      // get filter options
      Promise.all([
        orgProjectCategoriesFilter({
          id,
          search,
          keywords,
          domains,
          organisations,
          project_status,
          categories,
          token
        }),
        loadCategoryEntry({
          organisation: id,
          allow_projects: true
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
        logger(`useOrgProjectCategoriesList: ${err}`,'error')
      })
    }

    return ()=>{abort=true}
  },[
    search, keywords_json,
    domains_json, organisations_json,
    project_status, categories_json,
    id, token
  ])

  return {
    categoryFilters
  }
}
