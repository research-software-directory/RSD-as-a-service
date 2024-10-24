// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {getCategoryForSoftwareIds} from '~/utils/getSoftware'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {removeOrganisationCategoriesFromSoftware} from './apiSoftwareOrganisations'

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
          // collect tree leaves ids (end nodes)
          const availableIds = new Set<string>()
          categories.forEach(root=>{
            root.forEach(node=>{
              if (node.children().length === 0) {
                availableIds.add(node.getValue().id)
              }
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

    if (selectedCategoryIds.size === 0) {
      onComplete()
      return
    }

    // generate new collection
    const categoriesArrayToSave: {software_id: string, category_id: string}[] = []
    selected.forEach(id => {
      if (availableCategoryIds.has(id)) {
        categoriesArrayToSave.push({software_id: softwareId, category_id: id})
      }
    })

    // save organisation categories (if any)
    if (categoriesArrayToSave.length > 0){
      const categoryUrl = `${getBaseUrl()}/category_for_software`
      const resp = await fetch(categoryUrl, {
        method: 'POST',
        body: JSON.stringify(categoriesArrayToSave),
        headers: {
          ...createJsonHeaders(token)
        }
      })
      // debugger
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
    selectedCategoryIds,
    error,
    state,
    saveOrganisationCategories
  }
}
