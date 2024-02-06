// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {OrganisationRole} from '~/types/Organisation'
import {mentionColumns, MentionItemProps} from '~/types/Mention'
import {
  KeywordForProject,
  OrganisationsOfProject, Project,
  ProjectLink, ProjectListItem, ProjectStatusKey, RelatedProjectForProject,
  ResearchDomain, SearchProject, TeamMember
} from '~/types/Project'
import {RelatedSoftwareOfProject} from '~/types/SoftwareTypes'
import {getImageUrl} from './editImage'
import {extractCountFromHeader} from './extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from './fetchHelpers'
import logger from './logger'
import {ProjectStatusLabels} from '~/components/projects/overview/filters/ProjectStatusFilter'

export async function getProjectList({url, token}: { url: string, token?: string }) {
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'count=exact'
      },
    })

    if ([200, 206].includes(resp.status)) {
      const json: ProjectListItem[] = await resp.json()
      // set
      return {
        count: extractCountFromHeader(resp.headers),
        data: json
      }
    } else {
      logger(`getProjectList failed: ${resp.status} ${resp.statusText} ${url}`, 'warn')
      return {
        count: 0,
        data: []
      }
    }
  } catch (e: any) {
    logger(`getProjectList: ${e?.message}`, 'error')
    return {
      count: 0,
      data: []
    }
  }
}

//used by view and edit pages
export async function getProjectItem({slug,token}:
  {slug: string, token: string}) {
  try{
    // get project by slug
    const query = `project?slug=eq.${slug}`
    let url = `${getBaseUrl()}/${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.status===200){
      const rawData: Project[] = await resp.json()
      if (rawData && rawData.length === 1) {
        // delete data.image_for_project
        return rawData[0]
      }
      return undefined
    }
  }catch(e:any){
    // console.log("getProject...failed:", e)
    logger(`getProjectItem: ${e?.message}`,'error')
    // return []
    return undefined
  }
}

export async function getOrganisationsOfProject({project, token, frontend = true, roles}:
  { project: string, token: string, frontend?: boolean, roles?: OrganisationRole[] }) {
  try {
    let query = `rpc/organisations_of_project?project_id=${project}&order=position,name.asc`
    if (roles) query += `&role=in.(${roles.toString()})`
    // SSR request within docker network
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
    // console.log('getOrganisationsOfProject...url...',url)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200) {
      const json: OrganisationsOfProject[] = await resp.json()
      return json
    }
    logger(`getOrganisationsOfProject: ${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getOrganisationsOfProject: ${e?.message}`, 'error')
    return []
  }
}

export async function getOrganisations({project, token, frontend = true}:
  { project: string, token: string, frontend?: boolean}) {
  const resp = await getOrganisationsOfProject({project, token, frontend})
  // filter only approved organisations
  // extract only used properties
  const organisations = resp.filter(item => {
    return item.status === 'approved'
  })
    .map(item => {
      return {
        slug: item.slug,
        name: item.name,
        website: item.website ?? '',
        // extend basic path to link to projects tab and use default order
        rsd_path: `${item.rsd_path}?tab=projects&order=is_featured`,
        logo_url: getImageUrl(item.logo_id),
        role: item.role
      }
    })
  // console.log('getOrganisations...organisations...', organisations)
  return organisations
}

/**
 * Calculate project status based on date_start and date_end values.
 * NOTE!
 * 1. Ensure values follow SQL logic in project_status() RPC of 105-project-views.
 * 2. Ensure used labels are same as ProjectStatusLabels used in the filter dropdown
 */
export function getProjectStatus({date_start, date_end}:
  {date_start: string, date_end: string}) {
  try {
    const start_date = new Date(date_start)
    const end_date = new Date(date_end)
    const today = new Date()

    let statusKey: ProjectStatusKey = 'unknown'

    if (today < start_date) statusKey = 'upcoming'
    if (today > end_date) statusKey = 'finished'
    if (today > start_date && today < end_date) statusKey = 'in_progress'

    if (statusKey!=='unknown') {
      return ProjectStatusLabels[statusKey]
    }
    return ''
  } catch (e:any) {
    logger(`getProjectStatus: ${e?.message}`, 'error')
    // error value return starting
    return ''
  }
}

export async function getResearchDomainsForProject({project, token, frontend = false}:
  { project: string, token: string, frontend?: boolean }
) {
  try {
    const query = `rpc/research_domain_by_project?project=eq.${project}&order=key.asc`
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend === true) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: ResearchDomain[] = await resp.json()
      return data
    }
    logger(`getKeywordsForProject: [${resp.status}] ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getKeywordsForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function getKeywordsForProject({project, token, frontend = false}:
  { project: string, token: string, frontend?: boolean }
) {
  try {
    const query = `rpc/keywords_by_project?project=eq.${project}&order=keyword.asc`
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend === true) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: KeywordForProject[] = await resp.json()
      return data
    }
    logger(`getKeywordsForProject: [${resp.status}] ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getKeywordsForProject: ${e?.message}`, 'error')
    return []
  }
}


export async function getLinksForProject({project, token, frontend = false}:
  { project: string, token: string, frontend?: boolean }) {
  try {
    let query = `url_for_project?project=eq.${project}&order=position.asc`
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend === true) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: ProjectLink[] = await resp.json()
      return data
    }
    logger(`getLinksForProject: [${resp.status}] ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getLinksForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function getMentionsForProject({project, token, table}:
  {project: string, token?: string, table: 'output_for_project'|'impact_for_project'}) {
  try {
    // build query url
    const query = `project?id=eq.${project}&select=id,slug,mention!${table}(${mentionColumns})&mention.order=mention_type.asc`
    // construct url
    const url = `${getBaseUrl()}/${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request single object item
        'Accept': 'application/vnd.pgrst.object+json'
      }
    })
    if (resp.status === 200) {
      const json = await resp.json()
      // extract mentions from project object
      const mentions: MentionItemProps[] = json?.mention ?? []
      return mentions
    }
    logger(`getMentionsForProject: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getMentionsForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function getImpactByProject({project, token}:
  {project: string, token?: string}) {
  try {
    // the content is ordered by type ascending
    const query = `project=eq.${project}&order=mention_type.asc`
    // construct url
    const url = `${getBaseUrl()}/rpc/impact_by_project?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.status === 200) {
      const json = await resp.json()
      // extract mentions from software object
      const mentions: MentionItemProps[] = json ?? []
      return mentions
    }
    logger(`getImpactForProject: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getImpactForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function getTeamForProject({project, token}:
  {project: string, token?: string}) {
  try {
    // build url
    const query = `project_id=${project}&order=position.asc,given_names.asc`
    const url = `${getBaseUrl()}/rpc/project_team?${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const data: TeamMember[] = await resp.json()
      return data
    }
    logger(`getTeamForProject: ${resp.status} ${resp.statusText} [${url}]`, 'warn')
    // / query not found
    return []
  } catch (e: any) {
    logger(`getTeamForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function getRelatedProjectsForProject({project, token, frontend, approved = true, order}:
  { project: string, token?: string, frontend?: boolean, approved?: boolean, order?:string }) {
  try {
    // construct api url based on request source
    let query = `rpc/related_projects_for_project?project_id=${project}`
    if (order) {
      query += `&order=${order}`
    } else {
      // default project order
      query += '&order=current_state.desc,date_start.desc,title.asc'
    }
    if (approved) {
      // select only approved and published relations
      query += '&status=eq.approved&is_published=eq.true'
    }
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: RelatedProjectForProject[] = await resp.json()
      return data
    }
    logger(`getRelatedProjects: ${resp.status} ${resp.statusText} [${url}]`, 'warn')
    // query not found
    return []
  } catch (e: any) {
    logger(`getRelatedProjects: ${e?.message}`, 'error')
    return []
  }
}


export async function getRelatedSoftwareForProject({project, token, frontend, approved = true}:
  { project: string, token?: string, frontend?: boolean, approved?: boolean}) {
  try {
    let query = `rpc/related_software_for_project?project_id=${project}&order=brand_name.asc`
    if (approved) {
      // select only approved and published relations
      query += '&status=eq.approved&is_published=eq.true'
    }
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: RelatedSoftwareOfProject[] = await resp.json()
      return data
    }
    logger(`getRelatedSoftwareForProject: ${resp.status} ${resp.statusText} [${url}]`, 'warn')
    // query not found
    return []
  } catch (e: any) {
    logger(`getRelatedSoftwareForProject: ${e?.message}`, 'error')
    return []
  }
}

export async function searchForRelatedProjectByTitle({project, searchFor, token}: {
  project: string, searchFor: string, token?: string
}) {
  try {
    let query = `&title=ilike.*${searchFor}*&is_published=eq.true&order=title.asc&limit=50`
    // software item to exclude
    if (project) {
      query += `&id=neq.${project}`
    }
    const url = `/api/v1/project?select=id,slug,title,subtitle,image_id${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: SearchProject[] = await resp.json()
      return json
    }
    logger(`searchForRelatedProjectByTitle: ${resp.status} ${resp.statusText} [${url}]`, 'warn')
    return []
  } catch (e: any) {
    logger(`searchForRelatedProjectByTitle: ${e?.message}`, 'error')
    return []
  }
}
