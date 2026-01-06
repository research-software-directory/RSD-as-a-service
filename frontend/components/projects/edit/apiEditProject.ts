// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {
  NewProject, ProjectLink, ResearchDomainForProject
} from '~/types/Project'
import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {colForCreate, EditOrganisation, OrganisationRole, OrganisationStatus} from '~/types/Organisation'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {createOrganisation} from '~/components/organisation/apiEditOrganisation'

// query for software item page based on slug
export async function validProjectItem(slug: string | undefined, token?: string) {
  try {
    // this request is always performed from frontend
    const url = `/api/v1/project?select=id,slug&slug=eq.${slug}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createJsonHeaders(token)
      })
    } else {
      resp = await fetch(url, {method: 'GET'})
    }
    if (resp.status === 200) {
      const data = await resp.json()
      return data.length === 1
    }
    return false
  } catch (e: any) {
    logger(`validProjectItem: ${e?.message}`, 'error')
    return false
  }
}

export async function addProject({project, token}:
{project: NewProject, token: string}) {
  try {
    // console.log('addProject...called...', software)
    const url = '/api/v1/project'
    // make post request
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify(project)
    })
    if (resp.status === 201) {
      // no data response
      return {
        status: 201,
        message: project.slug
      }
    }
    // construct message
    const data = await resp.json()
    const message = data?.message ?? resp.statusText
    logger(`addProject: ${message}`, 'warn')
    // return message
    return {
      status: resp.status,
      message
    }
  } catch (e: any) {
    logger(`addProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

/**
 * Returns item with updated props on success
 */
export async function createOrganisationAndAddToProject({project, item, token, role='participating'}:
{item: EditOrganisation, project: string, token: string, role?: OrganisationRole}) {
  // extract props we need for createOrganisation
  const organisation = getPropsFromObject(item, colForCreate)
  // create new organisation
  let resp = await createOrganisation({
    organisation,
    token
  })
  // only 201 accepted
  if (resp.status !== 201) {
    // on error we return resp status
    return resp
  }
  // we receive id in message
  // const id = resp.message
  item.id = resp.message
  if (item.id) {
    // add this organisation to software
    resp = await addOrganisationToProject({
      project,
      organisation: item.id,
      role,
      position: item.position,
      token
    })
    if (resp.status === 200) {
      // we receive assigned status in message
      item.status = resp.message
      // return updated item
      return {
        status: 200,
        message: item
      }
    }
    // debugger
    return resp
  } else {
    return {
      status: 400,
      message: 'Organisation id is missing.'
    }
  }
}

export async function addOrganisationToProject({project, organisation, role, position, token}:
{project: string, organisation: string, role: OrganisationRole, position:number|null, token:string}) {
  try {
    // by default request status is approved
    const status = 'approved'
    // POST
    const url = '/api/v1/project_for_organisation'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify({
        project,
        organisation,
        status,
        role,
        position
      })
    })
    if ([200, 201].includes(resp.status)) {
      // return status assigned to organisation
      return {
        status: 200,
        message: status
      }
    }
    // debugger
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`addOrganisationToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchProjectForOrganisation({project, organisation, data, token}:
{project: string, organisation: string, data: any, token: string}) {
  try {
    const query = `project=eq.${project}&organisation=eq.${organisation}`
    const url = `/api/v1/project_for_organisation?${query}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    // debugger
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchOrganisationPositions({project,organisations, token}:
{project:string,organisations:EditOrganisation[],token:string}) {
  try {
    if (organisations.length === 0) return {
      status: 400,
      message: 'Empty organisations array'
    }
    // create all requests
    const requests = organisations.map(organisation => {
      const query = `project=eq.${project}&organisation=eq.${organisation.id}`
      const url = `/api/v1/project_for_organisation?${query}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: organisation.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchOrganisationPositions: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteOrganisationFromProject({project, organisation, role, token}:
{project: string, organisation:string, role: OrganisationRole, token:string}) {
  try {
    // POST
    const url = `/api/v1/project_for_organisation?project=eq.${project}&organisation=eq.${organisation}&role=eq.${role}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // debugger
    return extractReturnMessage(resp, organisation)
  } catch (e: any) {
    logger(`deleteOrganisationsFromProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addResearchDomainToProject({data, token}:
{data: ResearchDomainForProject[], token: string}) {
  try {
    // POST array of items at once
    const url = '/api/v1/research_domain_for_project'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, '')
  } catch (e: any) {
    logger(`addResearchDomainToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteResearchDomainFromProject({project, research_domain, token}:
{project: string, research_domain: string, token: string}) {
  try {
    // DELETE record based on project and research_domain uuid
    const query = `research_domain_for_project?project=eq.${project}&research_domain=eq.${research_domain}`
    const url = `/api/v1/${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      }
    })
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`deleteResearchDomainFromProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addProjectLink({link, token}:
{link: ProjectLink, token: string}) {
  try {
    // POST
    const url = '/api/v1/url_for_project'

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(link)
    })

    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        return {
          status: 201,
          message: id
        }
      }
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
    // debugger
    return extractReturnMessage(resp, link.project ?? '')
  } catch (e: any) {
    logger(`addProjectLinks: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateProjectLink({link, token}:
{link: ProjectLink, token: string}) {
  try {
    // PATCH
    const url = `/api/v1/url_for_project?id=eq.${link.id}`

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(link)
    })
    // debugger
    return extractReturnMessage(resp, link.project ?? '')
  } catch (e: any) {
    logger(`updateProjectLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchProjectLinkPositions({links, token}:
{links: ProjectLink[], token: string}) {
  try {
    // create all requests
    const requests = links.map(link => {
      const url = `/api/v1/url_for_project?id=eq.${link.id}`
      return fetch(url, {
        method: 'PATCH',
        headers: {
          ...createJsonHeaders(token),
        },
        // just update position!
        body: JSON.stringify({
          position: link.position
        })
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    return extractReturnMessage(responses[0])
  } catch (e: any) {
    logger(`patchProjectLinksPosition: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteProjectLink({id,token}:{id:string,token:string}) {
  try {
    // DELETE
    const url = `/api/v1/url_for_project?id=eq.${id}`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, id ?? '')
  } catch (e: any) {
    logger(`deleteProjectLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function createMaintainerLink({project,account,token}:{project:string,account:string,token:string}) {
  try {
    // POST
    const url = '/api/v1/invite_maintainer_for_project'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        project,
        created_by:account
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/project/${id}`
        return {
          status: 201,
          message: link
        }
      }
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`createMagicLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addRelatedSoftware({project,software,status,token}: {
  project: string, software: string, status: OrganisationStatus, token: string
}) {
  const url = '/api/v1/software_for_project'

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      software,
      project,
      status
    })
  })

  return extractReturnMessage(resp)
}

export async function deleteRelatedSoftware({project, software, token}: {
  project: string, software: string, token: string
}) {

  const url = `/api/v1/software_for_project?software=eq.${software}&project=eq.${project}`

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return extractReturnMessage(resp)
}

export async function addRelatedProject({origin, relation, status, token}: {
  origin: string, relation: string, status: OrganisationStatus, token: string
}) {
  const url = '/api/v1/project_for_project'

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify({
      origin,
      relation,
      status
    })
  })

  return extractReturnMessage(resp)
}

export async function deleteRelatedProject({origin, relation, token}: {
  origin: string, relation: string, token: string
}) {

  const url = `/api/v1/project_for_project?origin=eq.${origin}&relation=eq.${relation}`

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return extractReturnMessage(resp)
}
