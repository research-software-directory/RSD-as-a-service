// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
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

export type TreeSelectProps<T> = {
  roots: TreeNode<T>[]
  textExtractor: (value: T) => string
  keyExtractor: (value: T) => string
  onSelect: (node: TreeNode<T>) => void
  isSelected: (node: TreeNode<T>) => boolean
}

type RecursiveTreeSelectProps<T> = {
  textExtractor: (value: T) => string
  keyExtractor: (value: T) => string
  onSelect: (node: TreeNode<T>) => void
  isSelected: (node: TreeNode<T>) => boolean
  nodes: TreeNode<T>[]
}

function RecursivelyGenerateItems<T>({
  isSelected,
  keyExtractor,
  nodes,
  onSelect,
  textExtractor
}: RecursiveTreeSelectProps<T>) {
  return nodes.map(node => {
    const val = node.getValue()

    const key = keyExtractor(val)
    const text = textExtractor(val)

    // show checkbox only on 'lower level' items where parent!=null
    if (node.childrenCount() === 0 && (val as any)?.parent !== null) {
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
          <RecursivelyGenerateItems
            textExtractor={textExtractor}
            onSelect={onSelect}
            keyExtractor={keyExtractor}
            isSelected={isSelected}
            nodes={node.children()} />
        </ul>
      </ListSubheader>
    )
  })
}

export default function TreeSelect<T>({
  isSelected,
  keyExtractor,
  onSelect,
  roots,
  textExtractor
}: Readonly<TreeSelectProps<T>>) {

  return (
    <FormControl fullWidth>
      <InputLabel id="category-general-label">Select a category</InputLabel>
      <Select labelId="category-general-label" label="Select a category">
        <RecursivelyGenerateItems
          textExtractor={textExtractor}
          onSelect={onSelect}
          keyExtractor={keyExtractor}
          isSelected={isSelected}
          nodes={roots} />
      </Select>
    </FormControl>
  )
}
