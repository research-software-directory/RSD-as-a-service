// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import React from 'react'
import {useCategoryTree} from '~/utils/categories'
import {SidebarHeadline} from '../typography/SidebarHeadline'
import {CategoryTreeLevel, CategoryTreeLevelProps} from './CategoryTree'
import {CategoryPath} from '~/types/Category'

type CategoriesWithHeadlinesProps = {
  categories: CategoryPath[]
  onRemove?: CategoryTreeLevelProps['onRemove']
}

export const CategoriesWithHeadlines = ({categories, onRemove}: CategoriesWithHeadlinesProps) => {
  const tree = useCategoryTree(categories)

  return tree.map(({category, children}) => {
    return <React.Fragment key={category.short_name}>
      <SidebarHeadline iconName={category.properties.icon} title={category.name} />
      <div className='ml-4'>
        <CategoryTreeLevel items={children} onRemove={onRemove}/>
      </div>
    </React.Fragment>
  })
}
