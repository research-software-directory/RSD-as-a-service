// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useMemo} from 'react'
import {CategoryEntry, CategoryPath} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {categoryEntriesToRoots} from '~/components/category/apiCategories'

const compareCategoryEntry = (p1: CategoryEntry, p2: CategoryEntry) => p1.name.localeCompare(p2.name)
const compareCategoryTreeNode = (p1: TreeNode<CategoryEntry>, p2: TreeNode<CategoryEntry>) => compareCategoryEntry(p1.getValue(), p2.getValue())

export const categoryTreeNodesSort = (trees: TreeNode<CategoryEntry>[]) => {
  trees.sort(compareCategoryTreeNode)
  for (const root of trees) {
    root.sortRecursively(compareCategoryEntry)
  }
}

/**
 * Sort (ascending) the complete category tree, at all levels, on name property .
 * @param trees TreeNode<CategoryEntry>[]
 */
export function sortCategoriesByName(trees: TreeNode<CategoryEntry>[]){
  trees.sort(compareCategoryTreeNode)
  for (const root of trees) {
    // sort children first
    if (root.childrenCount()>0){
      sortCategoriesByName(root.children())
    }
    // sort roots
    root.sortRecursively(compareCategoryEntry)
  }
}

const genCategoryTreeNodes = (categories: CategoryPath[]=[]) : TreeNode<CategoryEntry>[] => {
  const allEntries: CategoryEntry[] = []

  for (const path of categories) {
    for (const entry of path) {
      allEntries.push(entry)
    }
  }

  const result = categoryEntriesToRoots(allEntries)

  sortCategoriesByName(result)

  return result
}

export function useCategoryTree(categories: CategoryPath[]) : TreeNode<CategoryEntry>[]{
  return useMemo(() => genCategoryTreeNodes(categories), [categories])
}

