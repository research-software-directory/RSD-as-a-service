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
import {saveSoftwareCategories, SoftwareCategories} from '../organisations/apiSoftwareOrganisations'
import {removeCommunityCategoriesFromSoftware} from './apiSoftwareCommunities'

type UseSoftwareCommunityCategoriesProps={
  communityId:string|null,
  softwareId:string
}

export default function useCommunityCategories({
  communityId,softwareId
}:UseSoftwareCommunityCategoriesProps){
  const {token} = useSession()
  const [categories, setCategories] = useState<TreeNode<CategoryEntry>[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'error' | 'ready' | 'saving'>('loading')
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set())
  const [availableCategoryIds, setAvailableCategoryIds] = useState<Set<string>>(new Set())

  // console.group('useCommunityCategories')
  // console.log('state...',state)
  // console.log('categories...', categories)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (communityId && softwareId && token){
      Promise.all([
        loadCategoryRoots({community:communityId}),
        getCategoryForSoftwareIds(softwareId, token)
      ])
        .then(([roots,selected]) => {
          // sort categories
          sortCategoriesByName(roots)
          // collect ids
          const availableIds = new Set<string>()
          roots.forEach(root=>{
            root.forEach(node=>{
              availableIds.add(node.getValue().id)
            })
          })
          if (abort) return
          // save values
          setAvailableCategoryIds(availableIds)
          setCategories(roots)
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
  }, [communityId, softwareId, token])


  async function saveCommunityCategories(selected:Set<string>,onComplete:()=>void) {
    // delete old selection
    if (communityId){
      const deleteErrorMessage = await removeCommunityCategoriesFromSoftware(softwareId, communityId, token)
      if (deleteErrorMessage !== null) {
        setError(`Failed to save categories: ${deleteErrorMessage}`)
        setState('error')
        return
      }
    }

    if (selectedCategoryIds.size === 0) {
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

    // save community categories for software (if any)
    if (categoriesArrayToSave.length > 0){
      const resp = await saveSoftwareCategories(categoriesArrayToSave,token)
      // debugger
      if (resp.status===200) {
        // signal we are done
        onComplete()
      } else {
        setError(`Failed to save categories: ${resp.message}`)
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
    saveCommunityCategories
  }
}
