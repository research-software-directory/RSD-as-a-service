// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useMemo, useState} from 'react'
import {CategoryEntry, CategoryPath, CategoryTree, CategoryTreeLevel} from '~/types/Category'
import logger from './logger'
import {loadCategoryRoots} from '~/components/category/apiCategories'
import {TreeNode} from '~/types/TreeNode'

export const leaf = <T>(list: T[]) => list[list.length - 1]

const compareCategoryEntry = (p1: CategoryEntry, p2: CategoryEntry) => p1.name.localeCompare(p2.name)
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

export type ReorderedCategories = {
  // available categories as paths and tree structure
  paths: CategoryPath[],
  all: CategoryTree,
  // sorted categories
  highlighted: CategoryTree,
  general: CategoryTree,
}

export function reorderCategories(allCategoryPaths: CategoryPath[]): ReorderedCategories {
  const all = genCategoryTree(allCategoryPaths)
  const highlighted: CategoryTree = []
  const general: CategoryTree = []

  for (let treeLevel of all) {
    if (treeLevel.category.properties.is_highlight) {
      highlighted.push(treeLevel)
    } else {
      general.push(treeLevel)
    }
  }

  return {
    all,
    paths: allCategoryPaths,
    highlighted,
    general,
  }
}

function rootsToPaths(roots: TreeNode<CategoryEntry>[]): CategoryPath[] {
  const result: CategoryPath[] = []

  const treeNodeStack: TreeNode<CategoryEntry>[] = []
  const resultStack: CategoryPath[] = []
  for (const root of roots) {
    treeNodeStack.push(root)
    resultStack.push([root.getValue()!])
  }

  while (treeNodeStack.length > 0) {
    const node = treeNodeStack.pop()!
    const path = resultStack.pop()!
    if (node.childrenCount() === 0) {
      result.push(path)
      continue
    }

    for (const child of node.children()) {
      treeNodeStack.push(child)
      resultStack.push([...path, child.getValue()!])
    }
  }

  return result
}

export function useReorderedCategories(community: string | null): ReorderedCategories {
  const [reorderedCategories, setReorderedCategories] = useState<ReorderedCategories>({
    all: [],
    paths: [],
    highlighted: [],
    general: [],
  })

  useEffect(() => {
    loadCategoryRoots(community)
      .then(roots => rootsToPaths(roots))
      .then(categories => setReorderedCategories(reorderCategories(categories)))
  }, [community])

  return reorderedCategories
}
