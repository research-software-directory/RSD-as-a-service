// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

export type CategoryID = string // NOSONAR ignore: typescript:S6564

export type CategoryProperties = {
  icon?: string
  is_highlight?: boolean
  subtitle?: string
  description?: string
  tree_level_labels?: string[]
}

export type CategoryEntry = {
  id: CategoryID
  parent: CategoryID | null
  short_name: string
  name: string
  properties: CategoryProperties
}


export type CategoryPath = CategoryEntry[]

export type CategoryTreeLevel = {
  category: CategoryEntry
  children: CategoryTreeLevel[]
}
export type CategoryTree = CategoryTreeLevel[]
