// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Types used in software pages (view/add/edit)
 */

import {AutocompleteOption} from './AutocompleteOptions'
import {CategoryPath} from './Category'
import {OrganisationStatus} from './Organisation'

export type NewSoftwareItem = {
  slug: string,
  brand_name: string,
  concept_doi: string | null,
  description: string | null,
  description_url: string | null,
  description_type: 'markdown' | 'link',
  get_started_url: string | null,
  is_published: boolean,
  short_statement: string | null,
  image_id: string | null,
}

export type SoftwareTableItem = NewSoftwareItem & {
  id: string,
  created_at: string,
  updated_at: string | null,
}

export type SoftwareOverviewItemProps = {
  id: string
  rsd_host: string | null
  domain: string | null
  slug: string
  brand_name: string
  short_statement: string
  image_id: string | null
  updated_at: string | null
  contributor_cnt: number | null
  mention_cnt: number | null
  is_published: boolean
  keywords: string[]
  prog_lang: string[]
  licenses: string
  downloads?: number
}


// used in editSoftware.updateSoftwareInfo function
// to extract the properties needed for PATCH method
// from larger form object.
// NOTE! patch method of postgrest fails if you send
// properties that are not part of the table
export const SoftwarePropsToSave = [
  'id',
  'slug',
  'brand_name',
  'concept_doi',
  'description',
  'description_type',
  'description_url',
  'get_started_url',
  'image_id',
  'is_published',
  'short_statement'
]

export type EditSoftwareImage = {
  image_b64: string | null
  image_mime_type: string | null
}

export type EditSoftwareItem = SoftwareTableItem & EditSoftwareImage & {
  keywords: KeywordForSoftware[]
  categories: CategoriesForSoftware
  categoryForSoftwareIds: CategoryForSoftwareIds
  licenses: AutocompleteOption<License>[]
}

/**
 * Keywords
 */

export type KeywordForSoftware = {
  id: string | null
  software: string
  keyword: string
  // passed to save function
  action?: 'add' | 'create'
  // passed to save function for updating form value with uuid
  pos?: number
}

// NOTE: why not use CategoryPath[]?
export type CategoriesForSoftware = CategoryPath[]

export type CategoryForSoftwareIds = Set<string>

/**
 * LICENSES
 */

export type LicenseForSoftware = {
  software: string
  license: string
  reference: string | null,
  open_source: boolean
  name: string
}

export type License = LicenseForSoftware & {
  id?: string,
  deprecated?: boolean,
}

/**
 * RELATED TOOLS / SOFTWARE
 */

export type SearchSoftware = {
  id: string
  slug: string
  brand_name: string
  short_statement: string
}

export type RelatedSoftwareOfSoftware = SearchSoftware & {
  is_featured?: boolean
  updated_at?: string
  status: OrganisationStatus
}

export type RelatedSoftwareOfProject = SearchSoftware & {
  project: string
  status: OrganisationStatus
}


