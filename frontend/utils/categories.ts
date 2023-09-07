// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useMemo} from 'react'
import {CategoryPath, CategoryTree, CategoryTreeLevel} from '~/types/Category'

export const leaf = <T>(list: T[]) => list[list.length - 1]

export const genCategoryTree = (categories: CategoryPath[]) : CategoryTree => {
  const tree: CategoryTree = []
  if (!Array.isArray(categories)) return tree

  for (const path of categories) {
    let cursor = tree
    for (const item of path) {
      const found = cursor.find(el => el.category.id == item.id)
      if (found) {
        cursor = found.children
      } else {
        const sub: CategoryTreeLevel = {category: item, children: []}
        cursor.push(sub)
        cursor = sub.children
      }
    }
  }
  return tree
}

export const useCategoryTree = (categories: CategoryPath[]) : CategoryTree => {
  return useMemo(() => genCategoryTree(categories), [categories])
}
