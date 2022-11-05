// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
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
  affiliation?: string | null
  role: string | null
  orcid: string | null
  position: number | null
  avatar_id: string | null
}

export type PatchPerson = {
  id: string | null
  is_contact_person?: boolean
  email_address?: string | null
  family_names?: string
  given_names?: string
  affiliation?: string | null
  role?: string | null
  orcid?: string | null
  position?: number | null
  avatar_id?: string | null
}

export type SaveContributor = Person & {
  software: string,
}

export type Contributor = Person & {
  software: string
  // ORCID delivers array of institutions
  institution?: string[] | null
  // avatar image for upload is stored in this props
  avatar_b64?: string | null
  avatar_mime_type?: string | null
}


export type SearchPerson = {
  given_names: string
  family_names: string
  email_address: string | null
  orcid: string | null
  // NOTE! added on 2022-02-11
  affiliation?: string | null
  // ORCID delivers array of institutions
  institution?: string[] | null
  display_name?: string | null
  source: 'RSD' | 'ORCID'
  // RSD entry provides avatar
  avatar_id?: string | null
}

export const Person = [
  'id',
  'is_contact_person',
  'email_address',
  'family_names',
  'given_names',
  'affiliation',
  'role',
  'orcid',
  'avatar_id',
  'position'
]

export const TeamMemberProps = [
  ...Person,
  'project'
]

export const ContributorProps = [
  ...Person,
  'software'
]
