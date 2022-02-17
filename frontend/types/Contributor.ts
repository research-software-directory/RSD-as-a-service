/**
 * Table definitions in 003-create-relations-for-software.sql
 */

export type NewContributor = {
  software: string
  is_contact_person: boolean
  given_names: string
  family_names: string
  email_address: string | null
  // NOTE! added on 2022-02-11
  affiliation?: string | null
  // NOTE! added on 2022-02-11
  role?: string | null
  // NOTE! added on 2022-02-11
  orcid?: string | null
  // NOTE! removed on 2022-02-11
  // name_suffix: string | null
  // NOTE! construct url based on id and mime-type
  // avatar_data: string | null
  avatar_data?: string | null
  avatar_mime_type?: string | null
}


export type Contributor = NewContributor & {
  id?: string
  avatar_url?: string | null
  // avatar_file?: string
  avatar_b64?: string | null
  // created_at?: string
  // updated_at?: string
}


export type SearchContributor = {
  given_names: string
  family_names: string
  email_address: string | null
  // NOTE! added on 2022-02-11
  affiliation?: string | null
  display_name?: string | null,
  orcid?: string
  source: 'RSD'|'ORCID'
}


export const ContributorProps = [
  'id',
  'software',
  'is_contact_person',
  'email_address',
  'family_names',
  'given_names',
  'affiliation',
  'role',
  'orcid',
  'avatar_mime_type'
]
