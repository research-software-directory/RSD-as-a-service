// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * Table definitions in 003-create-relations-for-software.sql
 */

export type Person = {
  id: string | null
  is_contact_person: boolean
  email_address: string | null
  family_names: string
  given_names: string
  affiliation: string | null
  role: string | null
  orcid: string | null
  position: number | null
  avatar_id: string | null
  account: string | null
  is_public?: boolean
}

export type PatchPerson = Person & {
  id: string
  is_contact_person?: boolean
  email_address?: string | null
  family_names?: string
  given_names?: string
  affiliation?: string | null
  role?: string | null
  orcid?: string | null
  account?: string | null
  avatar_id?: string | null
  position?: number | null
}

export type PatchContributor = PatchPerson & {
  software: string,
}

export type NewContributor = Person & {
  software: string
}

export type Contributor = Person & {
  software: string
  // ORCID delivers array of institutions
  institution?: string[] | null
  // avatar image for upload is stored in this props
  avatar_b64?: string | null
  avatar_mime_type?: string | null
}

export type SourceType = 'RSD' | 'ORCID'

export const PersonProps = [
  'id',
  'is_contact_person',
  'email_address',
  'family_names',
  'given_names',
  'affiliation',
  'role',
  'orcid',
  'avatar_id',
  'position',
  'account'
]

export const ContributorProps = [
  ...PersonProps,
  'software'
]
