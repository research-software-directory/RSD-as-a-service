// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
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
export async function loadCategoryRoots({community, organisation, allow_software, allow_projects}:LoadCategoryProps){
  const result: TreeNode<CategoryEntry>[] = []
  return result
}

// DEFAULT mock return empty array of categories
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function categoryEntriesToRoots(categoriesArr: CategoryEntry[]): TreeNode<CategoryEntry>[] {
  const result: TreeNode<CategoryEntry>[] = []
  return result
}
