// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Checkbox from '@mui/material/Checkbox'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'

type NodeWithChildrenProps = Readonly<{
  node: TreeNode<CategoryEntry>
  onSelect: (node: TreeNode<CategoryEntry>) => void
  isSelected: (node: TreeNode<CategoryEntry>) => boolean
  searchFor?: string
}>

function CategoryContent({
  cat,isSelected,onSelect
}:{
  cat: CategoryEntry
  onSelect: () => void
  isSelected: boolean
}){
  // top level category node
  // this node cannot be selected/checked
  if (cat.parent === null) {
    return (
      <ListItemText
        // alias Label
        primary={cat.short_name}
        // alias Description
        secondary={cat.name}
      />
    )
  }
  return (
    <ListItemButton
      onClick={onSelect}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          disableRipple
          checked={isSelected}
        />
      </ListItemIcon>
      <ListItemText
        // alias Label
        primary={cat.short_name}
        // alias Description
        secondary={cat.name}
      />
    </ListItemButton>
  )
}

function NodeWithChildren({
  node,
  isSelected,
  onSelect,
  searchFor
}:NodeWithChildrenProps){
  // open/close children panel
  const [open,setOpen] = useState(true)
  // get category
  const cat = node.getValue()

  return (
    <>
      <ListItem
        key={cat.id}
        title={cat.name}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="expand"
            onClick={()=>setOpen(!open)}
          >
            {open ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        }
        disablePadding
        dense
      >
        <CategoryContent
          cat={cat}
          isSelected={isSelected(node)}
          onSelect={()=>{
            onSelect(node)
          }}
        />
      </ListItem>
      {/* Children block */}
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit={false}
      >
        <List sx={{pl:'1rem'}}>
          <CategoryList
            categories={node.children()}
            onSelect={onSelect}
            isSelected={isSelected}
            searchFor={searchFor}
          />
        </List>
      </Collapse>
    </>
  )
}

export type CategoryListProps = {
  onSelect: (node: TreeNode<CategoryEntry>) => void
  isSelected: (node: TreeNode<CategoryEntry>) => boolean
  categories: TreeNode<CategoryEntry>[]
  searchFor?: string
}

export function CategoryList({
  categories,
  isSelected,
  onSelect,
  searchFor
}: CategoryListProps) {

  // console.group('CategoryList')
  // console.log('categories...', categories)
  // console.log('searchFor...', searchFor)
  // console.groupEnd()

  // copy to filtered
  let filtered = [...categories]
  // filter if search provided
  if (searchFor){
    filtered = categories
      .filter((node)=>{
        // filter items containing searchFor value
        return node.subTreeWhereLeavesSatisfy((item)=>{
          return item.short_name.toLocaleLowerCase().includes(searchFor.toLocaleLowerCase()) ||
            item.name.toLocaleLowerCase().includes(searchFor.toLocaleLowerCase())
        })
      })
  }

  if (filtered.length === 0 && searchFor){
    return (
      <Alert severity="info">
        <AlertTitle sx={{fontWeight:500}}>No match</AlertTitle>
        No category label or description found for <strong>{searchFor}</strong>.
      </Alert>
    )
  }

  // loop filtered categories
  return filtered
    .map(node => {
      const cat = node.getValue()

      // single cat element without children
      if (node.childrenCount() === 0) {
        return (
          <ListItem
            key={cat.id}
            title={cat.name}
            disablePadding
            dense
          >
            <CategoryContent
              cat={cat}
              isSelected={isSelected(node)}
              onSelect={()=>{
                onSelect(node)
              }}
            />
          </ListItem>
        )
      }

      return (
        <NodeWithChildren
          key={cat.id}
          node={node}
          isSelected={isSelected}
          onSelect={onSelect}
          searchFor={searchFor}
        />
      )
    })
}
