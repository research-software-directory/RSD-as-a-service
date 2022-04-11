export type Status = 'requested_by_origin' | 'requested_by_relation' | 'approved'

// shared organisation properies
export type CoreOrganisationProps = {
  id: string | null
  slug: string | null
  parent: string | null
  primary_maintainer?: string | null
  name: string
  ror_id: string | null
  website: string | null
  is_tenant: boolean,
}

// object for organisation
// from organisation table
export type Organisation = CoreOrganisationProps & {
  id: string
  // postgrest way of returning logo j
  logo_for_organisation?: [
    {
      'id': string
    }
  ]
}

// adding source
export type SearchOrganisation = CoreOrganisationProps & {
  source: 'RSD'|'ROR'|'MANUAL'
}

// extending with other props for software edit page
export type EditOrganisation = CoreOrganisationProps & {
  position?: number
  // indicates image already present
  logo_id: string | null
  // new image to upload
  logo_b64: string | null
  logo_mime_type: string | null
  source: 'RSD' | 'ROR' | 'MANUAL'
  status?: Status
  // only maintainers can edit values
  canEdit?: boolean
}

// object for software_for_organisation
export type SoftwareForOrganisation = {
  software: string,
  organisation: string,
  status: Status
}

// object returned from api
// based on view organisations_for_software
export type OrganisationsForSoftware={
  id: string
  parent: string | null
  slug: string | null
  primary_maintainer: string
  name: string
  ror_id: string
  is_tenant: boolean
  website: string | null
  logo_id: string | null
  status: Status
  software: string
}

export type ParticipatingOrganisationProps = {
  name: string
  website: string | null
  logo_url: string | null
  slug?: string
}

export type OrganisationForOverview = CoreOrganisationProps & {
  id: string
  logo_id: string | null
  software_cnt: number | null
  project_cnt: number | null
  children_cnt: number | null
}

export type SoftwareOfOrganisation = {
  id: string
  slug: string
  brand_name: string
  short_statement: string
  is_published: boolean
  is_featured: boolean
  contributor_cnt: number | null
  mention_cnt: number | null
  updated_at: string
  organisation: string
}

export type ProjectOfOrganisation = {
  id: string
  slug: string
  title: string
  subtitle: string
  date_start: string
  date_end: string
  updated_at: string
  is_published: boolean
  image_id: string | null
  organisation: string
  status: Status
}
