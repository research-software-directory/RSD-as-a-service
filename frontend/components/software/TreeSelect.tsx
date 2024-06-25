// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemText from '@mui/material/ListItemText'
import ListSubheader from '@mui/material/ListSubheader'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import {TreeNode} from '~/types/TreeNode'

export type TreeSelectProps<Type> = {
  roots: TreeNode<Type>[]
  textExtractor: (value: Type) => string
  keyExtractor: (value: Type) => string
  onSelect: (node: TreeNode<Type>) => void
  isSelected: (node: TreeNode<Type>) => boolean
}

type RecursiveTreeSelectProps<Type> = {
  indent: number
  nodes: TreeNode<Type>[]
}

export default function TreeSelect<Type>({
  isSelected,
  keyExtractor,
  onSelect,
  roots,
  textExtractor
}: Readonly<TreeSelectProps<Type>>) {
  function RecursivelyGenerateItems(propsRecursive: RecursiveTreeSelectProps<Type>) {
    return propsRecursive.nodes.map(node => {
      const val = node.getValue()
      if (val === null) {
        return null
      }

      const key = keyExtractor(val)
      const text = textExtractor(val)
      if (node.childrenCount() === 0) {
        return (
          <MenuItem dense disableRipple key={key} onClick={() => onSelect(node)}>
            <Checkbox disableRipple checked={isSelected(node)} />
            <ListItemText primary={text} />
          </MenuItem>
        )
      }

      return (
        <ListSubheader disableSticky key={key}>{text}
          <ul>
            <RecursivelyGenerateItems indent={propsRecursive.indent + 1} nodes={node.children()} />
          </ul>
        </ListSubheader>
      )
    })
  }

  return (
    <FormControl fullWidth>
      <InputLabel id="category-general-label">Select a category</InputLabel>
      <Select labelId="category-general-label" label="Select a category">
        <RecursivelyGenerateItems indent={0} nodes={roots}></RecursivelyGenerateItems>
      </Select>
    </FormControl>
  )
}
