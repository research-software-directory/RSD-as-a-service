// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {CategoryEntry, CategoryPath} from '~/types/Category'

type UseCategoriesProps = {
  categories: CategoryPath[]
  isMaintainer: boolean
  orgMaintainer: string[],
  comMaintainer: string[]
}

function categoryFilter({root,isMaintainer,orgMaintainer,comMaintainer}:{
  root:CategoryEntry,isMaintainer:boolean,orgMaintainer:string[],comMaintainer:string[]
}){
  switch (true){
    // OK categories to show to all
    case root?.status == 'global':
    case root?.status == 'other':
    case root?.status == 'approved':
      return true
    // maintainer sees all
    case isMaintainer:
      return true
    // organisation maintainer sees all organisation categories
    case root?.organisation && orgMaintainer.includes(root?.organisation):
      return true
    // community maintainer sees all community categories
    case root?.community && comMaintainer.includes(root?.community):
      return true
    default:
      // otherwise do not show category tree
      return false
  }
}

export function useSoftwareCategoriesFilter({
  categories=[],isMaintainer,orgMaintainer=[],comMaintainer=[]
}:UseCategoriesProps){
  const [highlightedCategories, setHighlightedCategories] = useState<CategoryPath[]>([])
  const [softwareCategories, setSoftwareCategories] = useState<CategoryPath[]>([])

  useEffect(()=>{
    let abort = false
    const highlights:CategoryPath[] =[]
    const software:CategoryPath[] = []

    categories?.forEach(path=>{
      const root = path[0]
      // highlighted categories
      if (root?.properties.is_highlight){
        highlights.push(path)
      } else if (categoryFilter({root,isMaintainer,orgMaintainer,comMaintainer})){
        software.push(path)
      }
    })
    // skip on abort
    if (abort) return
    // update state
    setHighlightedCategories(highlights)
    setSoftwareCategories(software)

    return ()=>{abort=true}
  },[categories,isMaintainer,orgMaintainer,comMaintainer])

  return [
    highlightedCategories,
    softwareCategories
  ]
}

export function useProjectCategoriesFilter({categories=[],isMaintainer,orgMaintainer=[],comMaintainer=[]}:UseCategoriesProps){
  const [filteredCategories, setFilteredCategories] = useState<CategoryPath[]>([])

  useEffect(()=>{
    let abort = false
    const projects:CategoryPath[] = categories?.filter(path=>{
      return categoryFilter({root:path[0],isMaintainer,orgMaintainer,comMaintainer})
    })
    // skip on abort
    if (abort) return
    // update state
    setFilteredCategories(projects)

    return ()=>{abort=true}
  },[categories,isMaintainer,orgMaintainer,comMaintainer])

  return filteredCategories
}
