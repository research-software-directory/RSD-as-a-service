// object for organisation
export type Organisation = {
  id: string | null
  slug?: string
  primary_maintainer?: string
  name: string
  ror_id?: string
  logo_id?: string | null
  is_tenant: boolean,
  website: string | null
}

// adding source
export type SearchOrganisation = Organisation & {
  source: 'RSD'|'ROR'|'MANUAL'
}

type Status = 'requested_by_origin' | 'requested_by_relation' | 'approved'

// extending with other props for software edit page
export type EditOrganisation = Organisation & {
  position?: number
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
export type OrganisationsForSoftware={
  software: string
  organisation: Organisation
  status: Status
}
