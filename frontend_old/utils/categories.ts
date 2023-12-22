// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useMemo} from 'react'
import {CategoryEntry, CategoryPath, CategoryTree, CategoryTreeLevel} from '~/types/Category'
import logger from './logger'

export const leaf = <T>(list: T[]) => list[list.length - 1]

const compareCategoryEntry = (p1: CategoryEntry, p2: CategoryEntry) => p1.short_name.localeCompare(p2.short_name)
const compareCategoryTreeLevel = (p1: CategoryTreeLevel, p2: CategoryTreeLevel) => compareCategoryEntry(p1.category, p2.category)

const categoryTreeSort = (tree: CategoryTree) => {
  tree.sort(compareCategoryTreeLevel)
  for (const item of tree) {
    categoryTreeSort(item.children)
  }
}

export const genCategoryTree = (categories: CategoryPath[]) : CategoryTree => {
  const tree: CategoryTree = []
  try {
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

    categoryTreeSort(tree)

    return tree
  } catch (e: any) {
    logger(`genCategoryTree failed to process data: ${e.message}`, 'error')
    return []
  }
}

export const useCategoryTree = (categories: CategoryPath[]) : CategoryTree => {
  return useMemo(() => genCategoryTree(categories), [categories])
}
