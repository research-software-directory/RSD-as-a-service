// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {CategoryEntry, CategoryPath} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {loadCategoryRoots} from '~/components/category/apiCategories'

export type ReorderedCategories = {
  paths: CategoryPath[],
  all: TreeNode<CategoryEntry>[],
  highlighted: TreeNode<CategoryEntry>[],
  general: TreeNode<CategoryEntry>[],
}

function reorderCategories(categoryRoots: TreeNode<CategoryEntry>[]): ReorderedCategories {
  const all: TreeNode<CategoryEntry>[] = categoryRoots
  const highlighted: TreeNode<CategoryEntry>[] = []
  const general: TreeNode<CategoryEntry>[] = []

  for (const root of all) {
    if (root.getValue().properties.is_highlight) {
      highlighted.push(root)
    } else {
      general.push(root)
    }
  }

  const paths = rootsToPaths(all)

  return {
    paths,
    all,
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
    resultStack.push([root.getValue()])
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
      resultStack.push([...path, child.getValue()])
    }
  }

  return result
}

export function useReorderedCategories(community: string | null): ReorderedCategories {
  const [reorderedCategories, setReorderedCategories] = useState<ReorderedCategories>({
    paths: [],
    all: [],
    highlighted: [],
    general: [],
  })

  useEffect(() => {
    loadCategoryRoots({community})
      .then(roots => setReorderedCategories(reorderCategories(roots)))
  }, [community])

  return reorderedCategories
}
