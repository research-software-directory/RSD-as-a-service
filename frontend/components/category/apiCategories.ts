// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry, CategoryID} from '~/types/Category'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {TreeNode} from '~/types/TreeNode'

export async function loadCategoryRoots(community: string | null){

  const communityFilter = community === null ? 'community=is.null' : `community=eq.${community}`

  const resp = await fetch(`${getBaseUrl()}/category?${communityFilter}`)

  const categoriesArr: CategoryEntry[] = await resp.json()

  return categoryEntriesToRoots(categoriesArr)

}

export function categoryEntriesToRoots(categoriesArr: CategoryEntry[]): TreeNode<CategoryEntry>[] {
  const map: Map<CategoryID, TreeNode<CategoryEntry>> = new Map()

  for (const cat of categoriesArr) {
    const id = cat.id
    let node

    if (!map.has(id)) {
      node = new TreeNode<CategoryEntry>(cat)
      map.set(id, node)
    } else {
      node = map.get(id) as TreeNode<CategoryEntry>
      node.setValue(cat)
    }

    if (cat.parent === null) {
      continue
    }

    const parentId = cat.parent
    if (!map.has(parentId)) {
      map.set(parentId, new TreeNode<CategoryEntry>(null))
    }

    map.get(parentId)!.addChild(node)
  }

  const result: TreeNode<CategoryEntry>[] = []

  for (const node of map.values()) {
    if (node.getValue()!.parent === null) {
      result.push(node)
    }
  }

  return result
}
