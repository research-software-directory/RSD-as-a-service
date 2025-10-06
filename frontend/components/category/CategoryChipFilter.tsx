// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Fragment} from 'react'
import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import TagChipFilter from '~/components/layout/TagChipFilter'
import useCategoryFilterUrl from './useCategoryFilterUrl'

function CategoryChipItem({cat}:Readonly<{cat:CategoryEntry}>){
  // construct filter url
  const {loading,url} = useCategoryFilterUrl(cat)

  return (
    <TagChipFilter
      key={cat.id}
      title={cat.name}
      label={cat.short_name}
      capitalize={false}
      url={url}
      loading={loading}
    />
  )
}

export function CategoryChipFilter({nodes}:Readonly<{nodes:TreeNode<CategoryEntry>[]}>){
  return nodes.map(node=>{
    const cat = node.getValue()
    const children = node.children()

    // console.group("CategoryChipFilter")
    // console.log("cat...",cat)
    // console.log("url...",url)
    // console.groupEnd()

    return (
      <Fragment key={cat.id}>
        <CategoryChipItem
          key={cat.id}
          cat={cat}
        />
        <CategoryChipFilter nodes={children} />
      </Fragment>
    )
  })
}
