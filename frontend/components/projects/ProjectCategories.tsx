// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath} from '~/types/Category'
import {useCategoryTree} from '~/utils/categories'
import SidebarSection from '../layout/SidebarSection'
import SidebarTitle from '../layout/SidebarTitle'
import {CategoryChipFilter} from '../category/CategoryChipFilter'

export default function ProjectCategories({categories}:{categories:CategoryPath[]}) {
  const tree = useCategoryTree(categories)

  // each root category is separate sidebar section
  return tree.map(node => {
    const category = node.getValue()
    const children = node.children()

    return (
      <SidebarSection key={category.id}>
        <SidebarTitle>{category.name}</SidebarTitle>
        <div className="flex flex-wrap gap-2">
          <CategoryChipFilter nodes={children} />
        </div>
      </SidebarSection>
    )
  })
}
