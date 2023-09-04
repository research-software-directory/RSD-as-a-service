// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'
import {CategoryID, CategoryPath, CategoryTree as TCategoryTree} from '~/types/Category'
import {genCategoryTree} from '~/utils/categories'

export type CategoryTreeLevelProps = {
   items: TCategoryTree
   onRemove?: (categoryId: CategoryID) => void
}
export const CategoryTreeLevel = ({items, onRemove}: CategoryTreeLevelProps) => {

  const onClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const categoryId = event.currentTarget.dataset.id!
    onRemove?.(categoryId)
  }

  type TreeLevelProps = {
    items: TCategoryTree
    indent?: boolean
  }
  const TreeLevel=({items, indent = false}: TreeLevelProps) => {
    return <ul className={'list-disc list-inside -indent-4' + (indent ? ' pl-7' : ' pl-4')}>
      {items.map((item, index) => (
        <li key={index}>
          {item.category.short_name}
          {item.children.length > 0
            ?
            <TreeLevel items={item.children} indent />
            :
            (onRemove && <IconButton size="small" data-id={item.category.id} onClick={onClickHandler}><CancelIcon /></IconButton>)
          }
        </li>
      ))}
    </ul>
  }

  return <TreeLevel items={items}/>
}

// FIXME: separate namespaces for components and types
type CategoryTreeProps = {
  categories: CategoryPath[]
  onRemove?: CategoryTreeLevelProps['onRemove']
}
export const CategoryTree = ({categories, onRemove}: CategoryTreeProps) => {
  const tree = genCategoryTree(categories)
  return <CategoryTreeLevel items={tree} onRemove={onRemove}/>
}
