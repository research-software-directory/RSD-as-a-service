// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type CategoryID = string // NOSONAR ignore: typescript:S6564

export type CategoryProperties = {
  icon?: string
  is_highlight?: boolean
  subtitle?: string
  description?: string
}

export type CategoryEntry = {
  id: CategoryID
  parent: CategoryID | null
  community: string | null
  short_name: string
  name: string
  properties: CategoryProperties
  provenance_iri: string | null
}


export type CategoryPath = CategoryEntry[]

export type CategoryTreeLevel = {
  category: CategoryEntry
  children: CategoryTreeLevel[]
}
export type CategoryTree = CategoryTreeLevel[]
