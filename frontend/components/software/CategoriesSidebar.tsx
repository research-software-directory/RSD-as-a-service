// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath} from '~/types/Category'
import SidebarSection from '~/components/layout/SidebarSection'
import SidebarTitle from '~/components/layout/SidebarTitle'
import {CategoryChipFilter} from '~/components/category/CategoryChipFilter'
import {useCategoryTree} from '~/components/category/useCategoryTree'
import CategoryIcon from '~/components/category/CategoryIcon'

export default function CategoriesSidebar({categories}:{categories:CategoryPath[]}) {
  const tree = useCategoryTree(categories)

  // console.group('CategoriesSidebar')
  // console.log('categories...', categories)
  // console.log('tree...', tree)
  // console.groupEnd()

  // each root category is separate sidebar section
  return tree.map(node => {
    const category = node.getValue()
    const children = node.children()

    return (
      <SidebarSection key={category.id}>
        <SidebarTitle
          title={category.name}
          className='flex gap-2 items-center'
        >
          <span><CategoryIcon name={category.properties.icon} /></span>
          <span>{category.short_name}</span>
        </SidebarTitle>
        <div className="flex flex-wrap gap-2">
          <CategoryChipFilter nodes={children} />
        </div>
      </SidebarSection>
    )
  })
}
