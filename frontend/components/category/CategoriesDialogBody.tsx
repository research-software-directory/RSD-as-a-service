// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
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
}>

export default function CategoriesDialogBody({
  categories,state,errorMsg,noItemsMsg,
  selectedCategoryIds, setSelectedCategoryIds
}:CategoriesDialogBodyProps) {


  function isSelected(node: TreeNode<CategoryEntry>) {
    const val = node.getValue()

    // directly selected
    if (selectedCategoryIds.has(val.id)) return true

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
        <Alert severity="error" sx={{marginTop: '0.5rem'}}>
          {errorMsg ?? '500 - Unexpected error'}
        </Alert>
      )

    case 'ready':
      return (
        <>
          {(categories === null || categories.length === 0)
            ?
            <Alert severity="info" sx={{'padding': '2rem'}}>
              {noItemsMsg}
            </Alert>
            :
            <List>
              <CategoryList
                categories={categories}
                isSelected={isSelected}
                onSelect={onSelect}
              />
            </List>
          }
        </>
      )
  }

}
