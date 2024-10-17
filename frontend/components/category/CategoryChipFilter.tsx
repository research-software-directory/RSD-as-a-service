// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Fragment} from 'react'
import {CategoryEntry, CategoryPath} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import TagChipFilter from '~/components/layout/TagChipFilter'

export function CategoryChipFilter({nodes}:{nodes:TreeNode<CategoryEntry>[]}){
  return nodes.map(node=>{
    const cat = node.getValue()
    const children = node.children()
    return (
      <Fragment key={cat.id}>
        <TagChipFilter key={cat.id} title={cat.name} label={cat.short_name} />
        <CategoryChipFilter nodes={children} />
      </Fragment>
    )
  })
}

