// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

// based on ENUMS defined in 012-inter-relation-tables.sql
export type Status = 'rejected_by_origin' | 'rejected_by_relation' | 'approved'
export type OrganisationRole = 'participating' | 'funding' | 'hosting'
export type OrganisationSource = 'RSD' | 'ROR' | 'MANUAL'

// shared organisation properies
export type CoreOrganisationProps = {
  id: string | null
  parent: string | null
  slug: string | null
  primary_maintainer?: string | null
  name: string
  ror_id: string | null
  is_tenant: boolean
  website: string | null
}

// object for organisation
// from organisation table
export type Organisation = CoreOrganisationProps & {
  // indicates image is uploaded
  logo_id: string | null
}

// adding source
export type SearchOrganisation = Organisation & {
  source: OrganisationSource
}

// extending with other props for software edit page
export type EditOrganisation = SearchOrganisation & {
  position?: number
  // new image to upload
  logo_b64: string | null
  logo_mime_type: string | null
  // source?: OrganisationSource
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

export type ProjectOrganisationProps = ParticipatingOrganisationProps & {
  role: OrganisationRole
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
  status: Status
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
  is_featured: boolean
  image_id: string | null
  organisation: string
  status: Status
}
