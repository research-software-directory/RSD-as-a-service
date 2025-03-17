// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import CancelIcon from '@mui/icons-material/Cancel'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {ssrSoftwareUrl} from '~/utils/postgrestUrl'

export type CategoryTreeLevelProps = {
  items: TreeNode<CategoryEntry>[]
  showLongNames?: boolean
  onRemove?: (categoryId: string) => void
}
export const CategoryTreeLevel = ({onRemove, ...props}: CategoryTreeLevelProps) => {

  const onRemoveHandler = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    const categoryId = event.currentTarget.dataset.id!
    onRemove?.(categoryId)
  }

  return <TreeLevel {...props} onRemoveHandler={onRemove && onRemoveHandler}/>
}


type TreeLevelProps = {
  items: TreeNode<CategoryEntry>[]
  showLongNames?: boolean
  onRemoveHandler? : (event: React.MouseEvent<HTMLElement>) => void
}
const TreeLevel = ({items, showLongNames, onRemoveHandler}: TreeLevelProps) => {
  return (
    <ul className={'list-disc list-outside pl-6'}>
      {items.map((item) => {
        const category = item.getValue()
        const children = item.children()
        const url = ssrSoftwareUrl({categories: [category.short_name]})
        return (
          <li key={category.id} >
            <div className='flex flex-row justify-between items-start'>
              <Link href={url}>
                <Tooltip title={showLongNames ? category.short_name : category.name} placement='left'>
                  <span className='pb-1'>{showLongNames ? category.name : category.short_name}</span>
                </Tooltip>
              </Link>
              { onRemoveHandler && children.length === 0 ?
				          <IconButton sx={{top: '-0.25rem'}} data-id={category.id} size='small'onClick={onRemoveHandler}>
                  <CancelIcon fontSize='small'/>
                </IconButton>
                :null
              }
            </div>
            {children.length > 0 ?
			        <TreeLevel items={children} showLongNames={showLongNames} onRemoveHandler={onRemoveHandler}/>
              : null
            }
          </li>
        )
      })}
    </ul>
  )
}
