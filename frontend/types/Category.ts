// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

export type CategoryID = string

export type CategoryEntry = {
  id: CategoryID
  parent: CategoryID | null
  short_name: string
  name: string
}


export type CategoryPath = CategoryEntry[]

export type CategoryTreeLevel = {
  category: CategoryEntry
  children: CategoryTreeLevel[]
}
export type CategoryTree = CategoryTreeLevel[]
