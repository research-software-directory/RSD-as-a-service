import {OrganisationRole, SearchOrganisation, Status} from './Organisation'
import {SearchContributor} from './Contributor'

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
  image_for_project?: [
    { project: string }
  ],
  url_for_project: ProjectLink[]
}

export type Project = BasicProject & {
  image_id: string | null
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
  logo_id: string | null
  status: Status
  role: OrganisationRole
  project: string
  parent: string | null
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
  // react-form unique id
  id: string | null
  title: string | null
  url: string | null
  position: number | null
  // project id
  project: string | null
}

export type ProjectLinkInForm = ProjectLink & {
  // id prop in database move
  uuid: string | null
}

export type ProjectLinkWithStatus = ProjectLink & {
  status?:'add'|'update'|'delete'
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

export type KeywordForProject = {
  id: string | null
  project: string
  keyword: string
  // passed to save function
  action?: 'add' | 'create'
  // passed to save function for updating form value with uuid
  pos?: number
}

export type EditProject = Project & {
  image_b64: string | null
  image_mime_type: string | null
  url_for_project: ProjectLinkInForm[]
  funding_organisations: OrganisationsOfProject[] | SearchOrganisation[]
  research_domains: ResearchDomain[] | null
  keywords: KeywordForProject[]
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

export type TeamMember = {
  id: string | null,
  project: string,
  is_contact_person: boolean,
  family_names: string,
  given_names: string,
  email_address: string | null,
  affiliation?: string | null,
  // ORCID delivers array of institutions
  // selected one is moved to affiliation
  institution?: string[] | null,
  role: string | null,
  orcid?: string | null,
  // base64 image in table
  avatar_data?: string | null
  avatar_mime_type?: string | null
  // image_url to use
  avatar_url?: string | null
  // uploaded raw image data
  avatar_b64?: string | null
}

export type SearchTeamMember = SearchContributor

export const ProjectTableProps = [
  'id', 'slug', 'title', 'subtitle', 'is_published',
  'description', 'date_start', 'date_end', 'image_caption',
  'grant_id'
]
