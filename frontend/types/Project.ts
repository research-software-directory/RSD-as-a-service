import {Status} from './Organisation'

export type BasicProject = {
  id: string
  slug: string
  title: string
  subtitle: string
  description?: string
  date_start: string
  date_end: string
  is_published: boolean
  image_caption?: string | null
  call_url: string | null
  code_url: string | null
  home_url: string | null
  software_sustainability_plan_url: string | null
  data_management_plan_url: string | null
  grant_id: string | null
  updated_at: string
}

export type RawProject = BasicProject & {
  image_for_project: [
    { project: string }
  ]
}

export type Project = BasicProject & {
  image_id: string | null
}

// object returned from api
// based on view organisations_of_project
export type OrganisationsOfProject = {
  id: string
  slug: string | null
  primary_maintainer: string
  name: string
  ror_id: string
  is_tenant: boolean
  website: string | null
  logo_id: string | null
  status: Status
  project: string
}

export type ProjectTag = {
  project: string,
  tag: string
}

export type ProjectTopic = {
  project: string,
  topic: string
}

export type ProjectLink = {
  label: string,
  url: string
}

export type RelatedProject = {
  origin: string
  id: string
  slug: string
  title: string
  subtitle: string
  updated_at: string
  date_end: string
  image_id: string | null
}
