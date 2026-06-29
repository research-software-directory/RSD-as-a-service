// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'
import {CategoryOption} from './CategoriesFilter'

export type CategoryFilter={
  name: string
  short_name: string
  options: CategoryOption[]
}

type CreateCategoryFiltersProps=Readonly<{
  nodes: TreeNode<CategoryEntry>[],
  level: number
}>

export function categoryFiltersFromTree({nodes, level = 0}: CreateCategoryFiltersProps){
  // root level
  if (level === 0) {
    const filters = nodes.reduce<CategoryFilter[]>((acc, node) => {
      const cat = node.getValue()
      const children = node.children()

      // recursively flatten children to CategoryOption[]
      const options = categoryFiltersFromTree({nodes: children, level: level + 1}) as CategoryOption[]

      // only add filter if it has options
      // top level items without options/children are excluded!
      if (options.length > 0) {
        acc.push({
          name: cat.name,
          short_name: cat.short_name,
          options: options
        })
      }

      return acc
    }, [])
    // return all filters with options
    return filters
  }

  // level > 0: return flat array of CategoryOption objects
  return nodes.reduce<CategoryOption[]>((acc, node) => {
    const cat = node.getValue()
    const children = node.children()

    // push the current node configuration
    acc.push({
      category: cat.short_name,
      category_cnt: cat.properties?.count ?? 0
    })

    // If it has children, recursively flatten them and push them into the same accumulator
    if (children.length > 0) {
      const childOptions = categoryFiltersFromTree({nodes: children, level: level + 1}) as CategoryOption[]
      acc.push(...childOptions)
    }

    return acc
  }, [])
}

export function addCountToEntryProps({
  categoryList,categoryEntry
}:{categoryList:CategoryOption[],categoryEntry:CategoryEntry[]}){
  categoryList.forEach(list=>{
    const entry = categoryEntry.find(item=>item.short_name===list.category)
    if (entry){
      entry.properties['count'] = list.category_cnt
    }
  })
}

/**
 * Sort filters and all its options by category name ASCENDING
 * Sorts an array in place. This method mutates the array and returns a reference to the same array.
 * @param filters
 */
export function sortFiltersAndOptionsByName(filters:CategoryFilter[]){
  // sort filters by short name
  filters.sort((a,b)=>a.short_name.localeCompare(b.short_name))
  // sort filter options by category (name)
  filters.forEach(filter=>{
    filter.options.sort((a,b)=> {
      // order by category name
      return a.category.localeCompare(b.category)
    })
  })
}
