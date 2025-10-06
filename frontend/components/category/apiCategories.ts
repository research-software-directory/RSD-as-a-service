// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'
import {getBaseUrl} from '~/utils/fetchHelpers'
import {TreeNode} from '~/types/TreeNode'
import logger from '~/utils/logger'

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

export async function getOrganisationSlug(id:string){
  try{
    const url=`${getBaseUrl()}/rpc/organisation_route?id=${id}`

    const resp = await fetch(url)

    if (resp.ok){
      const data:any = await resp.json()
      if (data[0]?.rsd_path){
        return data[0].rsd_path as string
      }
      return undefined
    }

    logger(`getOrganisationSlug ${resp.status}: ${resp.statusText}`)
    return undefined

  }catch(e:any){
    logger(`getOrganisationSlug: ${e?.message}`,'error')
    return undefined
  }
}

export async function getCommunitySlug(id:string){
  try{
    const url=`${getBaseUrl()}/community?id=eq.${id}&select=slug`

    const resp = await fetch(url)

    if (resp.ok){
      const data:any = await resp.json()
      if (data[0]?.slug){
        return data[0].slug
      }
      return undefined
    }

    logger(`getCommunitySlug ${resp.status}: ${resp.statusText}`)
    return undefined

  }catch(e:any){
    logger(`getCommunitySlug: ${e?.message}`,'error')
    return undefined
  }
}

export function categoryFilter({root,isMaintainer,orgMaintainer,comMaintainer}:{
  root:CategoryEntry,isMaintainer:boolean,orgMaintainer:string[],comMaintainer:string[]
}){
  switch (true){
    // OK categories to show to all
    case root?.status == 'global':
    case root?.status == 'other':
    case root?.status == 'approved':
      return true
    // maintainer sees all
    case isMaintainer:
      return true
    // organisation maintainer sees all organisation categories
    case root?.organisation && orgMaintainer.includes(root?.organisation):
      return true
    // community maintainer sees all community categories
    case root?.community && comMaintainer.includes(root?.community):
      return true
    default:
      // otherwise do not show category tree
      return false
  }
}
