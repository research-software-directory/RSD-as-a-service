// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import AlertTitle from '@mui/material/AlertTitle'

import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import ContentLoader from '../layout/ContentLoader'
import {CategoryList} from './CategoryList'

type CategoriesDialogBodyProps=Readonly<{
  categories: TreeNode<CategoryEntry>[],
  state: 'loading' | 'error' | 'ready' | 'saving',
  errorMsg: string | null
  noItemsMsg: string
  selectedCategoryIds: Set<string>,
  setSelectedCategoryIds: (ids:Set<string>)=>void
  searchFor?: string
}>

export default function CategoriesDialogBody({
  categories,state,errorMsg,noItemsMsg,
  selectedCategoryIds, setSelectedCategoryIds,
  searchFor
}:CategoriesDialogBodyProps) {


  function isSelected(node: TreeNode<CategoryEntry>) {
    const val = node.getValue()

    // directly selected child item
    if (selectedCategoryIds.has(val.id) && val.parent!==null) return true

    // any of children selected?
    const found = node.children().find(item=>{
      return isSelected(item)
    })
    if (found) {
      // add parent to list of selected items
      // if not already in the list
      if (selectedCategoryIds.has(val.id)===false){
        // debugger
        selectedCategoryIds.add(val.id)
        // update state at the end of cycle to avoid render error
        setTimeout(()=>{
          setSelectedCategoryIds(new Set(selectedCategoryIds))
        },0)
      }
      return true
    }
    // if top level item is in selected list BUT no children selected
    // WE NEED TO REMOVE TOP LEVEL ITEM because it is not selectable
    if (val.parent===null && selectedCategoryIds.has(val.id)){
      selectedCategoryIds.delete(val.id)
      // update state at the end of cycle to avoid render error
      setTimeout(()=>{
        setSelectedCategoryIds(new Set(selectedCategoryIds))
      },0)
    }
    // none of children selected either
    return false
  }

  function onSelect(node: TreeNode<CategoryEntry>,parent:boolean=false) {
    const val = node.getValue()
    if (selectedCategoryIds.has(val.id)) {
      // debugger
      selectedCategoryIds.delete(val.id)
      // deselect all children too
      node.children().forEach(item=>{
        // debugger
        onSelect(item,true)
      })
    } else if (parent===false) {
      // we toggle the value if onSelect
      // is NOT called by the parent node
      selectedCategoryIds.add(val.id)
    }
    // update state at the end of cycle to avoid render error
    setTimeout(()=>{
      setSelectedCategoryIds(new Set(selectedCategoryIds))
    },1)
  }

  switch (state) {
    case 'loading':
    case 'saving':
      return (
        <div className="flex-1 flex justify-center items-center">
          <ContentLoader/>
        </div>
      )

    case 'error':
      return (
        <Alert severity="error" sx={{marginTop: '0.5rem', height:'inherit', width:'inherit'}}>
          <AlertTitle sx={{fontWeight:500}}>Failed to load categories</AlertTitle>
          {errorMsg ?? '500 - Unexpected error'}
        </Alert>
      )

    case 'ready':
      if (categories.length === 0) {
        return (
          <Alert severity="info" sx={{'padding': '2rem', height:'inherit', width:'inherit'}}>
            <AlertTitle sx={{fontWeight:500}}>No categories</AlertTitle>
            {noItemsMsg}
          </Alert>
        )
      }


      // copy to filtered
      let filtered = [...categories]
      // filter if search provided
      if (searchFor){
        filtered = []
        const lowerCaseQuery = searchFor.toLocaleLowerCase()
        for (const root of categories) {
          const filteredTree = root.subTreeWhereNodesSatisfyWithChildren(item =>
            item.short_name.toLocaleLowerCase().includes(lowerCaseQuery) ||
            item.name.toLocaleLowerCase().includes(lowerCaseQuery)
          )

          if (filteredTree !== null) {
            filtered.push(filteredTree)
          }
        }
      }

      if (filtered.length === 0) {
        return (
          <Alert severity="info">
            <AlertTitle sx={{fontWeight:500}}>No match</AlertTitle>
            No category label or description found for <strong>{searchFor}</strong>.
          </Alert>
        )
      }

      return (
        <List>
          <CategoryList
            categories={filtered}
            isSelected={isSelected}
            onSelect={onSelect}
          />
        </List>
      )
  }

}
