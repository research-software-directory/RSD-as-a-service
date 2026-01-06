// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  NewProject, ProjectLink, ResearchDomainForProject
} from '~/types/Project'
import {EditOrganisation, OrganisationRole, OrganisationStatus} from '~/types/Organisation'

// query for software item page based on slug
export const validProjectItem=jest.fn(async(slug: string | undefined, token?: string)=>{
  // valid by default
  return true
})

export const addProject=jest.fn(async({project, token}:
{project: NewProject, token: string})=>{
  // valid by default
  return {
    status: 201,
    message: 'test-slug'
  }
})

/**
 * Returns item with updated props on success
 */
export const createOrganisationAndAddToProject=jest.fn(async({project, item, token, role='participating'}:
{item: EditOrganisation, project: string, token: string, role?: OrganisationRole})=>{
  // OK by default
  item.id = 'test-uuid-mock'
  return {
    status: 200,
    message: item
  }
})

export const addOrganisationToProject=jest.fn(async({project, organisation, role, position, token}:
{project: string, organisation: string, role: OrganisationRole, position:number|null, token:string})=>{
  // by default request status is approved
  const status = 'approved'
  // return status assigned to organisation
  return {
    status: 200,
    message: status
  }
})

export const patchProjectForOrganisation=jest.fn(async({project, organisation, data, token}:
{project: string, organisation: string, data: any, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const patchOrganisationPositions=jest.fn(async({project,organisations, token}:
{project:string,organisations:EditOrganisation[],token:string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteOrganisationFromProject=jest.fn(async({project, organisation, role, token}:
{project: string, organisation:string, role: OrganisationRole, token:string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const addResearchDomainToProject=jest.fn(async({data, token}:
{data: ResearchDomainForProject[], token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteResearchDomainFromProject=jest.fn(async({project, research_domain, token}:
{project: string, research_domain: string, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const addProjectLink = jest.fn(async({link, token}:
{link: ProjectLink, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const updateProjectLink=jest.fn(async({link, token}:
{link: ProjectLink, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const patchProjectLinkPositions=jest.fn(async({links, token}:
{links: ProjectLink[], token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteProjectLink=jest.fn(async({id,token}:{id:string,token:string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const createMaintainerLink=jest.fn(async({project,account,token}:{project:string,account:string,token:string})=>{
  return {
    status: 201,
    message: `${location.origin}/invite/project/mock-test-id`
  }
})

export const addRelatedSoftware=jest.fn(async({project,software,status,token}: {
  project: string, software: string, status: OrganisationStatus, token: string
})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteRelatedSoftware=jest.fn(async({project, software, token}: {
  project: string, software: string, token: string
})=> {
  return {
    status: 200,
    message: 'OK'
  }
})

export const addRelatedProject=jest.fn(async({origin, relation, status, token}: {
  origin: string, relation: string, status: OrganisationStatus, token: string
})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteRelatedProject=jest.fn(async({origin, relation, token}: {
  origin: string, relation: string, token: string
})=>{
  return {
    status: 200,
    message: 'OK'
  }
})
