// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {getCategoryForSoftwareIds} from '~/components/software/apiSoftware'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {sortCategoriesByName} from '~/components/category/useCategoryTree'
import {
  removeOrganisationCategoriesFromSoftware,
  saveSoftwareCategories,
  SoftwareCategories
} from './apiSoftwareOrganisations'

type UseSoftwareOrganisationCategoriesProps={
  organisationId:string|null,
  softwareId:string
}

export default function useSoftwareCategories({
  organisationId,softwareId
}:UseSoftwareOrganisationCategoriesProps){
  const {token} = useSession()
  const [categories, setCategories] = useState<TreeNode<CategoryEntry>[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready' | 'saving'>('loading')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set())
  const [availableCategoryIds, setAvailableCategoryIds] = useState<Set<string>>(new Set())

  // console.group('useSoftwareCategories')
  // console.log('state...',state)
  // console.log('categories...', categories)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (organisationId && softwareId && token){
      Promise.all([
        loadCategoryRoots({organisation:organisationId}),
        getCategoryForSoftwareIds(softwareId, token)
      ])
        .then(([roots,selected]) => {
          // filter top level categories for software (only top level items have this flag)
          const categories = roots.filter(item=>item.getValue().allow_software)
          // sort categories
          sortCategoriesByName(categories)
          // collect ids
          const availableIds = new Set<string>()
          categories.forEach(root=>{
            root.forEach(node=>{
              availableIds.add(node.getValue().id)
            })
          })
          if (abort) return
          // debugger
          // save values
          setAvailableCategoryIds(availableIds)
          setCategories(categories)
          setSelectedCategoryIds(selected)
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
  }, [organisationId, softwareId, token])


  async function saveOrganisationCategories(selected:Set<string>,onComplete:()=>void) {
    // delete old selection
    if (organisationId){
      const deleteErrorMessage = await removeOrganisationCategoriesFromSoftware(softwareId, organisationId, token)
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
    const categoriesArrayToSave: SoftwareCategories[] = []
    selected.forEach(id => {
      if (availableCategoryIds.has(id)) {
        categoriesArrayToSave.push({software_id: softwareId, category_id: id})
      }
    })

    // save organisation categories for software (if any)
    if (categoriesArrayToSave.length > 0){
      const resp = await saveSoftwareCategories(categoriesArrayToSave,token)
      // debugger
      if (resp.status===200) {
        // signal we are done
        onComplete()
      } else {
        setError(`Failed to save categories: ${resp.message()}`)
        setState('error')
      }
    }else{
      onComplete()
    }
  }

  return {
    categories,
    selectedCategoryIds,
    error,
    state,
    saveOrganisationCategories
  }
}
