// SPDX-FileCopyrightText: 2022 - 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Types used in software pages (view/add/edit)
 */

import {AutocompleteOption} from './AutocompleteOptions'
import {Status} from './Organisation'

export type CodePlatform = 'github' | 'gitlab' | 'bitbucket' | 'other'

export type RepositoryUrl = {
  software:string,
  url: string,
  // enum based on db enum defined as
  // platform_type in 003-create-relations-for-software.sql
  code_platform: CodePlatform,
  // options fields used to reset values on update
  // these are filled by scrapers
  languages?: string | null,
  languages_scraped_at?: string | null,
  license?: string | null,
  license_scraped_at?: string | null,
  commit_history?: string | null,
  commit_history_scraped_at?: string | null
}

export type NewSoftwareItem = {
  slug: string,
  brand_name: string,
  concept_doi: string | null,
  description: string | null,
  description_url: string | null,
  description_type: 'markdown'|'link',
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

export type SoftwareItem = SoftwareTableItem & {
  repository_url: string | null,
  repository_platform: CodePlatform | null
}

export type SoftwareItemFromDB = SoftwareTableItem & {
  repository_url: RepositoryUrl
}

export type SoftwareListItem = {
  id:string
  slug:string
  brand_name: string
  short_statement: string
  updated_at: string | null
  contributor_cnt: number | null
  mention_cnt: number | null
  is_published: boolean
  is_featured?: boolean
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

export type EditSoftwareItem = SoftwareItem & {
  keywords: KeywordForSoftware[]
  licenses: AutocompleteOption<License>[]
  image_b64: string | null
  image_mime_type: string | null
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

/**
 * LiCENSES
 */

export type LicenseForSoftware = {
  software: string
  license: string
}

export type License = LicenseForSoftware & {
  id?: string,
  deprecated?: boolean,
  name: string
}


export type ProgramingLanguages = {
  [key: string]: number
}

export type CommitHistory = {
  [key: string]: number
}

/**
 * REPOSITORY METRICS
 */
export type RepositoryInfo = {
  software: string,
  url: string,
  languages: ProgramingLanguages,
  license: string,
  commit_history: CommitHistory,
  commit_history_scraped_at: string,
  code_platform: CodePlatform
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
  status: Status
}

export type RelatedSoftwareOfProject = SearchSoftware & {
  project: string
  status: Status
}

export type RelatedTools = {
  origin: string,
  software: RelatedSoftwareOfSoftware
}

export type SoftwareForSoftware = {
  origin: string,
  relation: string
}

/**
 * USER PROFILE SETTINGS
 */

export type UserSettingsType = {
  agree_terms: boolean,
  notice_privacy_statement: boolean
}
