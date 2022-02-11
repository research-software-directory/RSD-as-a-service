/**
 * Table definitions in 003-create-relations-for-software.sql
 */

export type Contributor = {
  id: string
  software: string
  is_contact_person: boolean
  email_address: string | null
  family_names: string
  given_names: string
  // NOTE! added on 2022-02-11
  affiliation: string
  // NOTE! added on 2022-02-11
  role: string | null
  // NOTE! added on 2022-02-11
  orcid: string | null
  // NOTE! removed on 2022-02-11
  // name_suffix: string | null
  // NOTE! construct url based on id and mime-type
  // avatar_data: string | null
  avatar_url: string|null
  avatar_mime_type: string | null
  created_at: string
  updated_at: string
}
