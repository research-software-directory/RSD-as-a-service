// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {CategoryEntry} from '~/types/Category'
import {TreeNode} from '~/types/TreeNode'

type LoadCategoryProps={
  community?: string | null,
  organisation?: string | null,
  allow_software?: boolean,
  allow_projects?: boolean
}


// DEFAULT mock return empty array of categories
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loadCategoryRoots=jest.fn(async({community, organisation, allow_software, allow_projects}:LoadCategoryProps)=>{
  const result: TreeNode<CategoryEntry>[] = []
  return result
})

// DEFAULT mock return empty array of categories
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const categoryEntriesToRoots=jest.fn((categoriesArr: CategoryEntry[]): TreeNode<CategoryEntry>[]=>{
  const result: TreeNode<CategoryEntry>[] = []
  return result
})
