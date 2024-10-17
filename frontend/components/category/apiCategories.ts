// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {TreeNode} from '~/types/TreeNode'

type LoadCategoryProps={
  community?: string | null,
  organisation?: string | null,
  allow_software?: boolean,
  allow_projects?: boolean
}

export async function loadCategoryRoots({community, organisation, allow_software, allow_projects}:LoadCategoryProps){
  // global categories is default
  let categoryFilter = 'community=is.null&organisation=is.null'
  // community filter
  if (community){
    categoryFilter = `community=eq.${community}`
  }
  // organisation filter
  if (organisation){
    categoryFilter = `organisation=eq.${organisation}`
  }
  // software specific categories
  if (allow_software){
    categoryFilter+='&allow_software=eq.true'
  }
  // project specific categories
  if (allow_projects){
    categoryFilter+='&allow_projects=eq.true'
  }

  const resp = await fetch(`${getBaseUrl()}/category?${categoryFilter}`)

  if (!resp.ok) {
    throw new Error(`${await resp.text()}`)
  }

  const categoriesArr: CategoryEntry[] = await resp.json()

  return categoryEntriesToRoots(categoriesArr)

}

export function categoryEntriesToRoots(categoriesArr: CategoryEntry[]): TreeNode<CategoryEntry>[] {
  const idToNode: Map<string, TreeNode<CategoryEntry>> = new Map()
  const idToChildren: Map<string, TreeNode<CategoryEntry>[]> = new Map()

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
