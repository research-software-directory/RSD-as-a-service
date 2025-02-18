// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Fragment} from 'react'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import TagChipFilter from '~/components/layout/TagChipFilter'

export function CategoryChipFilter({nodes}:{nodes:TreeNode<CategoryEntry>[]}){
  return nodes.map(node=>{
    const cat = node.getValue()
    const children = node.children()
    return (
      <Fragment key={cat.id}>
        {/* Do not capitalize category labels */}
        <TagChipFilter key={cat.id} title={cat.name} label={cat.short_name} capitalize={false} />
        <CategoryChipFilter nodes={children} />
      </Fragment>
    )
  })
}

