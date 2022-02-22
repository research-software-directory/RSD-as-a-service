/**
 * Types used in software pages (view/add/edit)
 */

import {AutocompleteOption} from './AutocompleteOptions'

export type RepositoryUrl = {
  software:string,
  url:string
}

export type NewSoftwareItem = {
  slug: string,
  brand_name: string,
  concept_doi: string | null,
  description: string | null,
  description_url: string | null,
  description_type: 'markdown'|'link',
  get_started_url: string | null,
  is_featured: boolean,
  is_published: boolean,
  short_statement: string,
}

export type SoftwareTableItem = NewSoftwareItem & {
  id: string,
  created_at: string,
  updated_at: string | null,
}

export type SoftwareItem = SoftwareTableItem & {
  repository_url: string | null
}

export type SoftwareItemFromDB = SoftwareTableItem & {
  repository_url: RepositoryUrl[]
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
  'is_featured',
  'is_published',
  'short_statement'
]

export type EditSoftwareItem = SoftwareItem & {
  tags: AutocompleteOption<Tag>[]
  licenses: AutocompleteOption<License>[]
}

/**
 * TAGS
 */

export type Tag = {
  id?: string,
  software: string
  tag: string
}

/**
 * LiCENSES
 */

export type License = {
  id?: string,
  software: string
  license: string
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
  commit_history: CommitHistory
}

/**
 * RELATED TOOLS / SOFTWARE
 */

export type RelatedSoftware = {
  id: string,
  slug: string,
  brand_name: string,
  short_statement?: string,
}

export type RelatedTools = {
  origin: string,
  software: RelatedSoftware
}

export type SoftwareForSoftware = {
  origin: string,
  relation: string
}
