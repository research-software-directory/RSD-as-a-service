// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {useCategoryTree} from '~/utils/categories'
import {SidebarHeadline} from '../typography/SidebarHeadline'
import {CategoryPath} from '~/types/Category'
import {CategoryTreeLevel} from '~/components/category/CategoryTree'

type CategoriesWithHeadlinesProps = {
  categories: CategoryPath[]
}

export const CategoriesWithHeadlines = ({categories}: CategoriesWithHeadlinesProps) => {
  const tree = useCategoryTree(categories)

  return tree.map(node => {
    const category = node.getValue()
    if (category === null) {
      return null
    }
    const children = node.children()

    return <React.Fragment key={category.short_name}>
      <SidebarHeadline iconName={category.properties.icon} title={category.name} />
      <div className='ml-4'>
        <CategoryTreeLevel items={children} />
      </div>
    </React.Fragment>
  })
}
