// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath} from '~/types/Category'
import {useCategoryTree} from '~/components/category/useCategoryTree'
import SidebarSection from '~/components/layout/SidebarSection'
import SidebarTitle from '~/components/layout/SidebarTitle'
import {CategoryChipFilter} from '~/components/category/CategoryChipFilter'
import CategoryStatus from '../category/CategoryStatus'

export default function ProjectCategories({categories}:{categories:CategoryPath[]}) {
  const tree = useCategoryTree(categories)

  // console.group('ProjectCategories')
  // console.log('categories...', categories)
  // console.log('tree...', tree)
  // console.groupEnd()

  // each root category is separate sidebar section
  return tree.map(node => {
    const category = node.getValue()
    const children = node.children()

    // show category section only if it has children
    if (children.length > 0){
      return (
        <SidebarSection key={category.id}>
          <SidebarTitle title={category.name}>
            <span className="mr-2">{category.short_name}</span>
            {/* show status if not not approved/global/other */}
            <CategoryStatus category={category} />
          </SidebarTitle>
          <div className="flex flex-wrap gap-2">
            <CategoryChipFilter nodes={children} />
          </div>
        </SidebarSection>
      )
    }
  })
}
