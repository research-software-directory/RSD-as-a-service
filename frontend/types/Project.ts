// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SearchOrganisation, OrganisationRole, OrganisationStatus} from './Organisation'
import {Person} from './Contributor'

export type NewProject = {
  slug: string
  title: string
  is_published: boolean
  subtitle: string | null
  description: string | null
  date_start: string | null
  date_end: string | null
  image_caption: string | null
  image_contain: boolean
  image_id: string | null
  grant_id: string | null
}

export type BasicProject = NewProject & {
  id: string
  updated_at: string
}

export type Project = BasicProject & {
  image_id: string | null
}

export type EditProject = Project & {
  image_b64: string | null
  image_mime_type: string | null
  url_for_project: ProjectLink[]
  funding_organisations: SearchOrganisation[]
  research_domains: ResearchDomain[] | null
  keywords: KeywordForProject[]
}

export type ProjectStatusKey = 'upcoming' | 'in_progress' | 'finished' | 'unknown'
export type ProjectListItem = {
  id: string
  slug: string
  title: string
  subtitle: string
  date_start: string | null
  date_end: string | null
  updated_at: string | null
  is_published: boolean
  image_id: string | null
  image_contain: boolean
  keywords: string[] | null
  research_domain: string[] | null
  participating_organisations?: string[]
  impact_cnt: number | null
  output_cnt: number | null
  project_status: ProjectStatusKey
}

// object returned from api
// based on view organisations_of_project
export type OrganisationsOfProject = {
  id: string
  slug: string | null
  primary_maintainer: string | null
  name: string
  ror_id: string
  is_tenant: boolean
  website: string | null
  rsd_path: string
  logo_id: string | null
  status: OrganisationStatus
  role: OrganisationRole
  project: string
  parent: string | null
}


export type NewProjectLink = {
  // project id
  project: string | null
  title: string | null
  url: string | null
}

export type ProjectLink = NewProjectLink & {
  id: string | null
  position: number | null
}

export type SearchProject = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  status: OrganisationStatus
  image_id: string | null
}

export type RelatedProject = SearchProject & {
  current_state: ProjectStatusKey
  date_start: string | null
  updated_at: string | null
}

export type RelatedProjectForProject = RelatedProject & {
  origin: string
  relation: string
}

export type RelatedProjectForSoftware = RelatedProject & {
  software: string
}

export type KeywordForProject = {
  id: string | null
  project: string
  keyword: string
  // passed to save function for updating form value with uuid
  pos?: number
}

export type ResearchDomain = {
  id: string
  key: string
  name: string
  description: string
  parent: string | null
}

export type ResearchDomainForProject = {
  project?: string,
  research_domain: string
}

export type SaveTeamMember = Person & {
  project: string,
}

export type TeamMember = Person & {
  project: string,
  // ORCID delivers array of institutions
  // selected one is moved to affiliation
  institution?: string[] | null,
  // uploaded raw image data
  avatar_b64?: string | null
  avatar_mime_type?: string | null
}
