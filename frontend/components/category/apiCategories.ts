// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {TreeNode} from '~/types/TreeNode'

export async function loadCategoryRoots(community: string | null): Promise<TreeNode<CategoryEntry>[]> {
  const communityFilter = community === null ? 'community=is.null' : `community=eq.${community}`
  const resp = await fetch(`${getBaseUrl()}/category?${communityFilter}`)
  const categoriesArr: CategoryEntry[] = await resp.json()
  const map: Map<string, TreeNode<CategoryEntry>> = new Map()
  for (const cat of categoriesArr) {
    const id = cat.id
    let child
    if (!map.has(id)) {
      child = new TreeNode<CategoryEntry>(cat)
      map.set(id, child)
    } else {
      child = map.get(id) as TreeNode<CategoryEntry>
      child.setValue(cat)
    }

    if (cat.parent === null) {
      continue
    }

    const parentId = cat.parent
    if (!map.has(parentId)) {
      map.set(parentId, new TreeNode<CategoryEntry>(null))
    }
    map.get(parentId)!.addChild(child)
  }

  const result = []
  for (const node of map.values()) {
    if (node.getValue()!.parent === null) {
      result.push(node)
    }
  }

  return result
}
