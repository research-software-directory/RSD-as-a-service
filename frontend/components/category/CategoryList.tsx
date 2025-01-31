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

import {TreeNode} from '~/types/TreeNode'
import {CategoryEntry} from '~/types/Category'
import ListItemIcon from '@mui/material/ListItemIcon'

type NodeWithChildrenProps = Readonly<{
  node: TreeNode<CategoryEntry>
  onSelect: (node: TreeNode<CategoryEntry>) => void
  isSelected: (node: TreeNode<CategoryEntry>) => boolean
}>

function NodeWithChildren({
  node,
  isSelected,
  onSelect
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
        <ListItemButton onClick={() => onSelect(node)}>
          <ListItemIcon>
            <Checkbox edge="start" disableRipple checked={isSelected(node)} />
          </ListItemIcon>
          <ListItemText
            // alias Label
            primary={cat.short_name}
            // alias Description
            secondary={cat.name}
          />
        </ListItemButton>
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
}

export function CategoryList({
  categories,
  isSelected,
  onSelect
}: CategoryListProps) {
  // loop all categories
  return categories.map(node => {
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
          <ListItemButton onClick={() => onSelect(node)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                disableRipple
                checked={isSelected(node)}
              />
            </ListItemIcon>
            <ListItemText
              // alias Label
              primary={cat.short_name}
              // alias Description
              secondary={cat.name}
            />
          </ListItemButton>
        </ListItem>
      )
    }

    return (
      <NodeWithChildren
        key={cat.id}
        node={node}
        isSelected={isSelected}
        onSelect={onSelect}
      />
    )
  })
}
