// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

export type CategoryProperties = {
  icon?: string
  is_highlight?: boolean
  subtitle?: string
  description?: string
  tree_level_labels?: string[]
}

export type CategoryEntry = {
  id: string
  parent: string | null
  community: string | null
  organisation: string | null
  allow_software: boolean
  allow_projects: boolean
  short_name: string
  name: string
  properties: CategoryProperties
  provenance_iri: string | null
}


export type CategoryPath = CategoryEntry[]
