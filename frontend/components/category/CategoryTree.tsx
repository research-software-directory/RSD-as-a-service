// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import CancelIcon from '@mui/icons-material/Cancel'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {CategoryID, CategoryPath, CategoryTree as TCategoryTree} from '~/types/Category'
import {useCategoryTree} from '~/utils/categories'

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
  }
  const TreeLevel = ({items}: TreeLevelProps) => {
    return <ul className={'list-disc list-outside pl-6'}>
      {items.map((item, index) => (
        <li key={index}>
          <div className='flex flex-row justify-between items-start'>
            <Tooltip title={item.category.name} placement='left'>
              <span className='pb-1'>{item.category.short_name}</span>
            </Tooltip>
            {onRemove && item.children.length === 0 && <IconButton sx={{top:'-0.25rem'}} data-id={item.category.id} size='small' onClick={onClickHandler}><CancelIcon fontSize='small' /></IconButton>}
          </div>
          {item.children.length > 0 && <TreeLevel items={item.children}/> }
        </li>
      ))}
    </ul>
  }

  return <TreeLevel items={items}/>
}

type CategoryTreeProps = {
  categories: CategoryPath[]
  onRemove?: CategoryTreeLevelProps['onRemove']
}
export const CategoryTree = ({categories, onRemove}: CategoryTreeProps) => {
  const tree = useCategoryTree(categories)
  return <CategoryTreeLevel items={tree} onRemove={onRemove}/>
}
