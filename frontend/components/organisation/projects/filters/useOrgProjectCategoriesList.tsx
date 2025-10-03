// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import logger from '~/utils/logger'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {CategoryOption} from '~/components/filter/CategoriesFilter'
import useOrganisationContext from '~/components/organisation/context/useOrganisationContext'
import useProjectParams from '../../../projects/overview/useProjectParams'
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


function useOrgHasCategoriesFilter(id?:string){
  const [hasCategories, setHasCategories] = useState(false)

  useEffect(()=>{
    let abort = false

    if (id){
      loadCategoryRoots({organisation:id})
        .then(roots=>{
          const categories = roots.filter(item=>item.getValue().allow_projects)
          if (abort) return
          setHasCategories(categories.length > 0)
        })
    }

    return ()=>{abort=true}
  },[id])

  return hasCategories
}


export default function useOrgProjectCategoriesList(){
  const {token} = useSession()
  const {id} = useOrganisationContext()
  const hasCategories = useOrgHasCategoriesFilter(id)
  const {
    search,project_status,keywords_json,
    domains_json,organisations_json,categories_json
  } = useProjectParams()
  const [categoryList, setCategoryList] = useState<CategoryOption[]>([])

  useEffect(()=>{
    let abort = false

    if (id) {
      const keywords = decodeJsonParam(keywords_json, null)
      const domains = decodeJsonParam(domains_json, null)
      const organisations = decodeJsonParam(organisations_json, null)
      const categories = decodeJsonParam(categories_json, null)

      // get filter options
      orgProjectCategoriesFilter({
        id,
        search,
        keywords,
        domains,
        organisations,
        project_status,
        categories,
        token
      }).then(resp => {
        // abort
        if (abort) return
        setCategoryList(resp)
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
    hasCategories,
    categoryList
  }

}
