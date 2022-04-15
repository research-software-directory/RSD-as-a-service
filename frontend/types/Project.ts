import {Status} from './Organisation'

export type NewProject = {
  slug: string
  title: string
  is_published: boolean
  subtitle: string | null
  description: string | null
  date_start: string | null
  date_end: string | null
  image_caption: string | null
  grant_id: string | null
}

export type BasicProject = NewProject & {
  id: string
  updated_at: string
}

export type RawProject = BasicProject & {
  image_for_project: [
    { project: string }
  ],
  url_for_project: [{
    title: string,
    url: string,
    position: number | null
  }]
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
  title: string,
  url: string,
  position: number | null
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
