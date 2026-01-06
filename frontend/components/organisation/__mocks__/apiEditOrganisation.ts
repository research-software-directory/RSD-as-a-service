// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  CoreOrganisationProps,
  EditOrganisation, Organisation,
  OrganisationRole,
  OrganisationSource,
  PatchOrganisation,
  SearchOrganisation
} from '~/types/Organisation'
import {getSlugFromString} from '~/utils/getSlugFromString'

export const searchForOrganisation=jest.fn(async({searchFor, token}:
{searchFor: string, token?: string})=>{
  // nothing found by default
  return []
})

export const findRSDOrganisation=jest.fn(async({searchFor, token, rorIds}:
{searchFor: string, token?: string, rorIds: string[]})=>{
  // return nothing by default
  return []
})

export const getOrganisationsForSoftware=jest.fn(async({software, token}:
{software: string, token?: string})=>{
  return []
})

export const getParticipatingOrganisations=jest.fn(async({software, token}:
{software: string, token?: string})=>{
  return []
})

export const createOrganisation=jest.fn(async({organisation, token}:
{organisation: CoreOrganisationProps, token: string})=>{
  return {
    status: 201,
    message: 'new-organisation-id'
  }
})

export const updateOrganisation=jest.fn(async({organisation, token}:
{organisation: Organisation, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const patchOrganisation=jest.fn(async({data, token}:
{data: PatchOrganisation, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const deleteOrganisation=jest.fn(async({uuid,logo_id, token}:
{uuid: string, logo_id: string|null, token: string})=>{
  return {
    status: 200,
    message: 'OK'
  }
})

export const getRsdPathForOrganisation=jest.fn(async({uuid,token}:
{uuid: string, token?: string})=>{
  return {
    status: 200,
    message: 'test-rsd-path'
  }
})

export const searchToEditOrganisation=jest.fn(({item, account, position}:
{item: SearchOrganisation, account?: string, position?: number})=>{

  const addOrganisation: EditOrganisation = {
    ...item,
    logo_b64: null,
    logo_mime_type: null,
    position: position ?? null
  }

  if (item.source === 'ROR') {
    // ROR item has no RSD id
    addOrganisation.id = null
    // cannot be created as tenant from this page/location
    addOrganisation.is_tenant = false
    // created without primary maintainer
    addOrganisation.primary_maintainer = null
    // it cannot be edited
    addOrganisation.canEdit = false
    // slug is constructed
    addOrganisation.slug = getSlugFromString(item.name)
  }

  if (item.source === 'RSD') {
    // validate if user can edit this item
    addOrganisation.canEdit = item.primary_maintainer === account
  }

  return addOrganisation
})

type NewOrganisation = {
  name: string
  position?: number
  primary_maintainer: string | null
  role?: OrganisationRole
  is_tenant?: boolean
  parent?: string | null
}

export const newOrganisationProps=jest.fn((props: NewOrganisation)=>{
  const initOrg = {
    id: null,
    parent: props?.parent ?? null,
    name: props.name,
    is_tenant: props?.is_tenant ?? false,
    slug: null,
    ror_id: null,
    position: props.position ?? null,
    logo_b64: null,
    logo_mime_type: null,
    logo_id: null,
    website: null,
    source: 'MANUAL' as OrganisationSource,
    primary_maintainer: props.primary_maintainer,
    role: props?.role ?? 'participating',
    canEdit: false,
    description: null
  }
  return initOrg
})
