/**
 * Table definitions in 003-create-relations-for-software.sql
 * Based on record from contributor table
 * {
      "id": "b9de8c9b-f130-4203-bdaf-0b909a52eece",
      "software": "4598d493-598f-4e65-884e-3d84e5e58183",
      "is_contact_person": false,
      "email_address": null,
      "family_names": "Hua Zhao",
      "given_names": "Jing",
      "name_particle": null,
      "name_suffix": null,
      "avatar_data": null,
      "avatar_mime_type": null,
      "created_at": "2022-01-14T16:19:06.70371",
      "updated_at": "2022-01-14T16:19:06.70371"
    }
 */

export type Contributor = {
  id: string
  software: string
  is_contact_person: boolean
  email_address: string | null
  family_names: string
  given_names: string
  name_particle: string | null
  name_suffix: string | null
  // avatar_data: string | null
  // construct url based on id and mime-type
  avatar_url: string|null
  avatar_mime_type: string | null
  // NOTE! it should be added later
  affiliation:string
  created_at: string
  updated_at: string
}
