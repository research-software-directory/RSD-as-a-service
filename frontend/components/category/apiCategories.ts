// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry, CategoryID} from '~/types/Category'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {TreeNode} from '~/types/TreeNode'

export async function loadCategoryRoots(community: string | null): Promise<TreeNode<CategoryEntry>[]> {

  const communityFilter = community === null ? 'community=is.null' : `community=eq.${community}`

  const resp = await fetch(`${getBaseUrl()}/category?${communityFilter}`)

  if (!resp.ok) {
    throw new Error(`${await resp.text()}`)
  }

  const categoriesArr: CategoryEntry[] = await resp.json()

  return categoryEntriesToRoots(categoriesArr)

}

export function categoryEntriesToRoots(categoriesArr: CategoryEntry[]): TreeNode<CategoryEntry>[] {
  const idToNode: Map<CategoryID, TreeNode<CategoryEntry>> = new Map()
  const idToChildren: Map<CategoryID, TreeNode<CategoryEntry>[]> = new Map()

  for (const cat of categoriesArr) {
    const id = cat.id
    let node: TreeNode<CategoryEntry>

    if (!idToNode.has(id)) {
      node = new TreeNode<CategoryEntry>(cat)
      idToNode.set(id, node)
      if (idToChildren.has(id)) {
        for (const child of idToChildren.get(id)!) {
          node.addChild(child)
        }
      }
    } else {
      node = idToNode.get(id) as TreeNode<CategoryEntry>
      node.setValue(cat)
    }

    if (cat.parent === null) {
      continue
    }

    const parentId = cat.parent
    if (!idToNode.has(parentId)) {
      if (!idToChildren.has(parentId)) {
        idToChildren.set(parentId, [])
      }
      idToChildren.get(parentId)!.push(node)
    } else {
      idToNode.get(parentId)!.addChild(node)
    }


  }

  const result: TreeNode<CategoryEntry>[] = []

  for (const node of idToNode.values()) {
    if (node.getValue().parent === null) {
      result.push(node)
    }
  }

  return result
}
