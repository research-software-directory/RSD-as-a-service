// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {sortCategoriesByName} from '~/components/category/useCategoryTree'
import {getCategoryListForProject, removeOrganisationCategoriesFromProject} from './apiProjectOrganisations'

type UseProjectOrganisationCategoriesProps={
  organisationId:string|null,
  projectId:string
}

type ProjectCategory = {
  project_id: string,
  category_id: string
}

export default function useProjectCategories({
  organisationId,projectId
}:UseProjectOrganisationCategoriesProps){
  const {token} = useSession()
  const [categories, setCategories] = useState<TreeNode<CategoryEntry>[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready' | 'saving'>('loading')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [availableIds, setAvailableIds] = useState<Set<string>>(new Set())

  // console.group('useProjectOrganisationCategories')
  // console.log('state...',state)
  // console.log('categories...', categories)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (organisationId && projectId && token){
      Promise.all([
        loadCategoryRoots({organisation:organisationId}),
        getCategoryListForProject(projectId, token)
      ])
        .then(([roots,selected]) => {
          // filter top level categories for projects (only top level items have this flag)
          const categories = roots.filter(item=>item.getValue().allow_projects)
          // sort categories
          sortCategoriesByName(categories)
          // collect tree leaves ids (end nodes)
          const availableIds = new Set<string>()
          categories.forEach(root=>{
            root.forEach(node=>{
              availableIds.add(node.getValue().id)
            })
          })
          if (abort) return
          // debugger
          // save values
          setAvailableIds(availableIds)
          setCategories(categories)
          setSelectedIds(selected)
        })
        .catch(e => {
          if (abort) return
          setError(`Couldn't load categories: ${e}`)
          setState('error')
        })
        .finally(()=>{
          if (abort) return
          setState('ready')
        })
    }
    return ()=>{abort=true}
  }, [organisationId,projectId,token])

  async function saveOrganisationCategories(selected:Set<string>,onComplete:()=>void) {
    // delete old selection
    if (organisationId){
      const deleteErrorMessage = await removeOrganisationCategoriesFromProject(projectId, organisationId, token)
      if (deleteErrorMessage !== null) {
        setError(`Failed to save categories: ${deleteErrorMessage}`)
        setState('error')
        return
      }
    }

    if (selected.size === 0) {
      onComplete()
      return
    }

    // generate new collection
    const categoriesArrayToSave:ProjectCategory[] = []
    selected.forEach(id => {
      if (availableIds.has(id)) {
        categoriesArrayToSave.push({project_id: projectId, category_id: id})
      }
    })

    // save organisation categories (if any)
    if (categoriesArrayToSave.length > 0){
      const categoryUrl = `${getBaseUrl()}/category_for_project`
      const resp = await fetch(categoryUrl, {
        method: 'POST',
        body: JSON.stringify(categoriesArrayToSave),
        headers: {
          ...createJsonHeaders(token)
        }
      })

      if (resp.ok) {
        // signal we are done
        onComplete()
      } else {
        setError(`Failed to save categories: ${await resp.text()}`)
        setState('error')
      }
    }else{
      onComplete()
    }
  }

  return {
    categories,
    selectedIds,
    error,
    state,
    saveOrganisationCategories
  }
}
