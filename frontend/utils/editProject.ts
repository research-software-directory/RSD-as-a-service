import {UseFieldArrayUpdate} from 'react-hook-form'

import {Session} from '~/auth'
import isMaintainerOfOrganisation from '~/auth/permissions/isMaintainerOfOrganisation'
import logger from './logger'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage} from './fetchHelpers'
import {
  EditProject, KeywordForProject, NewProject,
  OrganisationsOfProject, Project, ProjectLink, ProjectTableProps, ResearchDomainForProject
} from '~/types/Project'
import {ProjectImageInfo} from '~/components/projects/edit/information'
import {ProjectLinksForSave} from '~/components/projects/edit/information/projectLinkChanges'
import {getPropsFromObject} from './getPropsFromObject'
import {EditOrganisation, OrganisationRole} from '~/types/Organisation'
import {createOrganisation} from './editOrganisation'
import {getSlugFromString} from './getSlugFromString'
import {CreateOrganisation, FundingOrganisationsForSave} from '~/components/projects/edit/information/fundingOrganisationsChanges'
import {KeywordsForSave} from '~/components/projects/edit/information/projectKeywordsChanges'
import {ResearchDomainsForSave} from '~/components/projects/edit/information/researchDomainChanges'
import {addKeywordsToProject, createKeyword, deleteKeywordFromProject} from './editKeywords'

// query for software item page based on slug
export async function validProjectItem(slug: string | undefined, token?: string) {
  try {
    // this request is always perfomed from frontend
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
  { project: NewProject, token: string }) {
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


export type SaveProjectInfoProps = {
  project: Project
  projectLinks: ProjectLinksForSave
  projectImage: ProjectImageInfo
  fundingOrganisations: FundingOrganisationsForSave
  researchDomains: ResearchDomainsForSave
  keywords: KeywordsForSave
  session: Session
}

export async function updateProjectInfo({project, projectLinks, projectImage, fundingOrganisations,
  researchDomains, keywords, session}: SaveProjectInfoProps) {
  // NOTE! update ProjectTableProps list if the data structure changes
  const projectTable:Project = getPropsFromObject(project, ProjectTableProps)
  // -----------------------------
  // Project table
  // -----------------------------
  // update project props
  const promises = [updateProjectTable({
    project: projectTable,
    token: session.token
  })]
  // -----------------------------
  // Project image
  // -----------------------------
  // handle project image
  if (projectImage.action !== 'none') {
    switch (projectImage.action) {
      case 'delete':
        promises.push(deleteImage({
          project: project.id,
          token: session.token
        }))
        break
      case 'add':
        promises.push(addImage({
          project: project.id,
          data: projectImage.image_b64 ?? '',
          mime_type: projectImage.image_mime_type ?? '',
          token: session.token
        }))
        break
      default:
        // update is default
        promises.push(updateImage({
          project: project.id,
          data: projectImage.image_b64 ?? '',
          mime_type: projectImage.image_mime_type ?? '',
          token: session.token
        }))
    }
  }
  // -----------------------------
  // Funding organisations
  // -----------------------------
  // create: request per organisation
  fundingOrganisations.create.forEach(item => {
    promises.push(
      createOrganisationAndAddToProject({
        project: project.id,
        organisation: item,
        role: 'funding',
        session,
        updateOrganisation: fundingOrganisations.updateOrganisation
      })
    )
  })
  // add: request per organisation
  fundingOrganisations.add.forEach(item => {
    if (item.id) {
      promises.push(
        addOrganisationToProject({
          project: project.id,
          organisation: item.id,
          role: 'funding',
          session
        })
      )
    }
  })
  // delete: request per organisations
  fundingOrganisations.delete.forEach(item => {
    promises.push(
      deleteOrganisationFromProject({
        project: item.project,
        organisation: item.organisation,
        token: session.token
      })
    )
  })
  // -----------------------------
  // Research Domains
  // -----------------------------
  // add research domains
  if (researchDomains.add.length > 0) {
    // add all items in one request
    promises.push(
      addResearchDomainToProject({
        data: researchDomains.add,
        token: session.token
      })
    )
  }
  // delete research domains from project
  researchDomains.delete.forEach(item => {
    // delete request per item
    promises.push(
      deleteResearchDomainFromProject({
        // no undefined at this stage
        project: item.project as string,
        research_domain: item.research_domain,
        token: session.token
      })
    )
  })
  // -----------------------------
  // Keywords
  // -----------------------------
  // create
  keywords.create.forEach(item => {
    promises.push(
      createKeywordAndAddToProject({
        data: item,
        token: session.token,
        // fn to update item in the form with uuid
        updateKeyword: keywords.updateKeyword
      })
    )
  })
  // add
  if (keywords.add.length >0){
    promises.push(
      addKeywordsToProject({
        // extract only needed data
        data: keywords.add.map(item => ({
          project: item.project,
          keyword: item.id ?? ''
        })),
        token: session.token
      })
    )
  }
  // delete
  keywords.delete.forEach(item => {
    promises.push(
      deleteKeywordFromProject({
        project: item.project,
        keyword: item.keyword,
        token: session.token
      })
    )
  })
  // -----------------------------
  // Project links
  // -----------------------------
  // delete: single request
  if (projectLinks.delete.length > 0) {
    promises.push(deleteProjectLink({
      ids: projectLinks.delete,
      token: session.token
    }))
  }
  // add: single request
  if (projectLinks.add.length > 0) {
    // single request to add all new links
    promises.push(addProjectLinksAndUpdateForm({
      project: project.id,
      links: projectLinks.add,
      token: session.token,
      // pass fn to update form
      updateUrl: projectLinks.updateUrl
    }))
  }
  // update: request per link
  projectLinks.update.forEach(updateLink => {
    if (updateLink.id) {
      promises.push(updateProjectLink({
        project: project.id,
        link: updateLink,
        token: session.token
      }))
    }
  })

  // make all requests
  const responses = await Promise.all(promises)
  const errors = extractErrorMessages(responses)
  // return result
  if (errors.length > 0) {
    // return first error for now
    return {
      status: errors[0].status,
      message: errors[0].message
    }
  }
  return {
    status: 200,
    message: project.id
  }
}

export async function updateProjectTable({project,token}:{project:Project,token:string}) {
  try {
    // PATCH
    const url = `/api/v1/project?id=eq.${project.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(project)
    })

    // debugger
    return extractReturnMessage(resp, project.id)

  } catch (e: any) {
    logger(`updateProjectTable: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function createOrganisationAndAddToProject({project,organisation,role,updateOrganisation, session}: {
  project: string, organisation: CreateOrganisation, role: OrganisationRole,
  updateOrganisation: UseFieldArrayUpdate<EditProject, 'funding_organisations'>,
  session: Session
}) {
  try {
    const newOrganisation: EditOrganisation = {
      id: null,
      parent: null,
      slug: getSlugFromString(organisation.name),
      primary_maintainer: organisation.primary_maintainer ?? session.user?.account ?? null,
      name: organisation.name,
      ror_id: organisation.ror_id,
      is_tenant: false,
      website: organisation.website,
      // indicates image already present
      logo_id: null,
      // new image to upload
      logo_b64: null,
      logo_mime_type: null,
    }
    // create organisation in RSD
    let resp = await createOrganisation({
      item: newOrganisation,
      token: session.token
    })
    // debugger
    if (resp.status == 201) {
      // we receive organisation id
      const id = resp.message
      // update organisation in the form
      updateOrganisation(organisation.pos, {
        // pass id to form
        id,
        parent: newOrganisation.parent,
        slug: newOrganisation.slug,
        primary_maintainer: newOrganisation.primary_maintainer,
        name: newOrganisation.name,
        ror_id: newOrganisation.ror_id,
        is_tenant: newOrganisation.is_tenant,
        logo_id: newOrganisation.logo_id,
        website: newOrganisation.website,
        // status is not accurate
        status: 'approved',
        role,
        project
      } as OrganisationsOfProject)
      // and we add organisation to project
      // as funding organisation
      return addOrganisationToProject({
        project,
        organisation: id,
        role,
        session
      })
    } else {
      debugger
      return resp
    }
  } catch(e:any) {
    logger(`createAndAddOrganisationToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addOrganisationToProject({project, organisation, role, session}:
  { project: string, organisation: string, role: OrganisationRole, session:Session }) {
  try {
    // validate if user is maintainer of organisation
    const isMaintainer = await isMaintainerOfOrganisation({
      organisation,
      account: session.user?.account,
      token: session.token
    })
    // POST
    const url = '/api/v1/project_for_organisation'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(session.token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        project,
        organisation,
        status: isMaintainer ? 'approved' : 'requested_by_origin',
        role
      })
    })
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

export async function deleteOrganisationFromProject({project,organisation,token}:
  { project: string, organisation:string, token:string }) {
  try {
    // POST
    const url = `/api/v1/project_for_organisation?project=eq.${project}&organisation=eq.${organisation}`
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

export async function createKeywordAndAddToProject({data, token, updateKeyword}:
  {data: KeywordForProject, token: string, updateKeyword: UseFieldArrayUpdate<EditProject, 'keywords'> }) {
  try {
    const resp = await createKeyword({
      keyword: data.keyword,
      token
    })
    if (resp.status === 201) {
      // do update here?
      if (data && data.pos) {
        // debugger
        updateKeyword(data.pos, {
          id: resp.message,
          project: data.project,
          keyword: data.keyword
        })
      }
      return addKeywordsToProject({
        data: [{
          project: data.project,
          // id of new keyword is in message
          keyword: resp.message
        }],
        token
      })
    }
    // debugger
    return resp
  } catch (e: any) {
    logger(`createKeywordAndAddToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
// REFACTORED and MOVED TO editKeywords.ts
// export async function createKeyword({keyword, token}: {keyword: string, token: string}) {
//   try {
//     // POST
//     const url = '/api/v1/keyword'
//     const resp = await fetch(url, {
//       method: 'POST',
//       headers: {
//         ...createJsonHeaders(token),
//         // return id in header
//         'Prefer': 'return=headers-only'
//       },
//       body: JSON.stringify({
//         value: keyword
//       })
//     })
//     if (resp.status === 201) {
//       // we need to return id of created record
//       // it can be extracted from header.location
//       const id = resp.headers.get('location')?.split('.')[1]
//       return {
//         status: 201,
//         message: id
//       }
//     }
//     // debugger
//     return extractReturnMessage(resp, keyword ?? '')
//   } catch (e:any) {
//     logger(`createKeyword: ${e?.message}`, 'error')
//     return {
//       status: 500,
//       message: e?.message
//     }
//   }
// }

// export async function addKeywordsToProject({data, token}:
//   { data: ProjectKeyword[], token: string }) {
//   try {
//     // POST
//     const url = '/api/v1/keyword_for_project'
//     const resp = await fetch(url, {
//       method: 'POST',
//       headers: {
//         ...createJsonHeaders(token),
//         // this will add new items and update existing
//         'Prefer': 'resolution=merge-duplicates'
//       },
//       body: JSON.stringify(data)
//     })
//     return extractReturnMessage(resp, '')
//   } catch (e: any) {
//     logger(`addKeywordToProject: ${e?.message}`, 'error')
//     return {
//       status: 500,
//       message: e?.message
//     }
//   }
// }

// export async function deleteKeywordFromProject({project, keyword, token}:
//   {project: string, keyword: string, token: string}) {
//   try {
//     // DELETE record based on project and keyword uuid
//     const query = `keyword_for_project?project=eq.${project}&keyword=eq.${keyword}`
//     const url = `/api/v1/${query}`
//     const resp = await fetch(url, {
//       method: 'DELETE',
//       headers: {
//         ...createJsonHeaders(token),
//         // this will add new items and update existing
//         'Prefer': 'resolution=merge-duplicates'
//       }
//     })
//     return extractReturnMessage(resp, project ?? '')
//   } catch (e: any) {
//     logger(`deleteKeywordFromProject: ${e?.message}`, 'error')
//     return {
//       status: 500,
//       message: e?.message
//     }
//   }
// }

export async function addResearchDomainToProject({data, token}:
  { data: ResearchDomainForProject[], token: string }) {
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
  { project: string, research_domain: string, token: string }) {
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


export async function addProjectLinksAndUpdateForm({project, links, token, updateUrl}:
  { project: string, links: ProjectLink[], updateUrl: UseFieldArrayUpdate<EditProject, 'url_for_project'>, token: string }) {
  try {
    // POST
    const url = '/api/v1/url_for_project'
    // add project id to links array
    const data = links.map(item => {
      return {
        ...item,
        project
      }
    })
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // return created items to update form
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(data)
    })
    if (resp.status === 201) {
      // get crated links
      const created: ProjectLink[] = await resp.json()
      // update form
      created.forEach(link => {
        // debugger
        if (link.id && link.position!==null) {
          updateUrl(link.position, {
            id: link.id,
            uuid: link.id,
            title: link.title,
            url: link.url,
            project: link.project,
            position: link.position
          })
        }
      })
      return {
        status: 200,
        message: 'OK'
      }
    } else {
      // debugger
      return extractReturnMessage(resp, project ?? '')
    }
  } catch (e: any) {
    logger(`addProjectLinks: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function addProjectLinks({project, links, token}:
  { project: string, links: ProjectLink[], token: string }) {
  try {
    // POST
    const url = '/api/v1/url_for_project'
    // add project id to links array
    const data = links.map(item => {
      return {
        ...item,
        project
      }
    })
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })
    // debugger
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`addProjectLinks: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateProjectLink({project, link, token}:
  { project: string, link: ProjectLink, token: string }) {
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
      body: JSON.stringify({
        ...link,
        project
      })
    })
    // debugger
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`updateProjectLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
// DELETE project links using array of ids
export async function deleteProjectLink({ids,token}:{ids:string[],token:string }) {
  try {
    // DELETE
    const url = `/api/v1/url_for_project?id=in.("${encodeURIComponent(ids.join('","'))}")`

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, ids.toString() ?? '')
  } catch (e: any) {
    logger(`deleteProjectLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addImage({project, data, mime_type,token}: {
  project:string,data:string,mime_type:string,token:string
}) {
  try {
    // POST
    const url = '/api/v1/image_for_project'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        project,
        data,
        mime_type
      })
    })
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`addImage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateImage({project, data, mime_type, token}: {
  project: string, data: string, mime_type: string, token: string
}) {
  try {
    // PATCH
    const url = `/api/v1/image_for_project?project=eq.${project}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify({
        project,
        data,
        mime_type
      })
    })
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`updateImage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteImage({project,token}:{project:string,token:string}) {
  try {
    // DELETE
    const url = `/api/v1/image_for_project?project=eq.${project}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp, project ?? '')
  } catch (e: any) {
    logger(`deleteImage: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
