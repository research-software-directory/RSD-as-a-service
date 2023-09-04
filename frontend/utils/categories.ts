// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryPath, CategoryTree, CategoryTreeLevel} from '~/types/Category'

export const genCategoryTree = (categories: CategoryPath[]) : CategoryTree => {
  const tree: CategoryTree = []
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
