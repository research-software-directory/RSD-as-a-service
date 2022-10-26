// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '../types/AutocompleteOptions'
import {
  EditOrganisation, Organisation,
  OrganisationRole,
  OrganisationsForSoftware,
  SearchOrganisation
} from '../types/Organisation'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import {getPropsFromObject} from './getPropsFromObject'
import {findInROR} from './getROR'
import {getSlugFromString} from './getSlugFromString'
import {itemsNotInReferenceList} from './itemsNotInReferenceList'
import logger from './logger'

// organisation colums used in editOrganisation.createOrganisation
const columsForCreate = [
  'parent','slug', 'primary_maintainer', 'name', 'ror_id', 'is_tenant', 'website',
]
// organisation colums used in editOrganisation.updateOrganisation
export const columsForUpdate = [
  'id',
  ...columsForCreate
]

export async function searchForOrganisation({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }) {
  try {
    // make requests to RSD and ROR
    const rorOptions = await findInROR({searchFor})
    const rorIdsFound: string[] = rorOptions.map(rorResult => rorResult.key)
    const rsdOptions = await findRSDOrganisation({searchFor, token, frontend, rorIds: rorIdsFound})
    // create options collection
    const options = [
      ...rsdOptions,
      ...itemsNotInReferenceList({
        list: rorOptions,
        referenceList: rsdOptions,
        key: 'key'
      })
    ]
    // return all options
    return options
  } catch (e: any) {
    logger(`searchForOrganisation: ${e?.message}`, 'error')
    return []
  }
}

export async function fetchRSDOrganisations({searchFor, rorIds, token, frontend}:
  { searchFor: string, rorIds: string[], token?: string, frontend?: boolean }) {
  try {
    let query
    if (rorIds.length) {
      const rorIdsCommaSeparated = rorIds.join(',')
      query = `rpc/organisations_overview?or=(name.ilike.*${searchFor}*,website.ilike.*${searchFor}*,ror_id.in.(${rorIdsCommaSeparated}))&limit=20`
    } else {
      query = `rpc/organisations_overview?or=(name.ilike.*${searchFor}*,website.ilike.*${searchFor}*)&limit=20`
    }
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.status === 200) {
      const data: Organisation[] = await resp.json()
      const options: AutocompleteOption<SearchOrganisation>[] = data.map(item => {
        return {
          // we use slug as primary key and ROR id as alternative
          key: item?.ror_id ?? item?.slug ?? item.name,
          label: item.name ?? '',
          data: {
            ...item,
            source: 'RSD'
          }
        }
      })
      return options
    }
    logger(`fetchRSDOrganisations ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
    return []
  } catch (e: any) {
    logger(`fetchRSDOrganisations: ${e?.message}`, 'error')
    return []
  }
}

export async function findRSDOrganisation({searchFor, token, frontend, rorIds}:
  { searchFor: string, token?: string, frontend?: boolean, rorIds: string[] }){
  try {
    // search for term in name, website and rorIds
    const fetchResults = await fetchRSDOrganisations({searchFor, rorIds, token, frontend})
    return fetchResults
  } catch (e:any) {
    logger(`findRSDOrganisation: ${e?.message}`, 'error')
    return []
  }
}

export async function getOrganisationsForSoftware({software, token, frontend = true}:
  { software: string, token?: string, frontend?: boolean }) {
  const query = `rpc/organisations_of_software?software_id=${software}&order=position,name.asc`
  let url = `/api/v1/${query}`
  if (frontend === false) {
    // SSR request within docker network
    url = `${process.env.POSTGREST_URL}/${query}`
  }
  try {
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200) {
      const json: OrganisationsForSoftware[] = await resp.json()
      return json
    }
    return []
  } catch (e:any) {
    logger(`getOrganisationsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function getParticipatingOrganisations({software, token, frontend = true}:
  {software: string, token?: string, frontend?: boolean}) {
  const resp = await getOrganisationsForSoftware({software, token, frontend})
  // filter only approved organisations
  // extract only properties used
  // sort on name
  const organisations = resp.filter(item => {
    return item.status === 'approved'
  }).map(item => {
    return {
      slug: item.slug,
      name: item.name,
      website: item.website,
      rsd_path: item.rsd_path,
      logo_url: getUrlFromLogoId(item.logo_id)
    }
  })
  return organisations
}

export async function saveExistingOrganisation({item, token, pos, setState}:
  {item: EditOrganisation, token: string, pos:number, setState: (item:EditOrganisation,pos:number)=>void}) {
  if (!item.id) return {
    status: 400,
    message: 'Organisation id missing.'
  }
  // update existing organisation
  const resp = await updateOrganisation({
    item,
    token
  })
  if (resp.status === 200) {
    const organisation = updateDataObjectAfterSave({
      data: item,
      id: item.id
    })
    // update local list
    setState(organisation, pos)
    // return OK state
    return {
      status: 200,
      message: 'OK'
    }
  } else {
    // showErrorMessage(resp.message)
    return resp
  }
}

export async function createOrganisation({item, token}:
  {item: EditOrganisation, token: string}) {
  try {
    // extract only required items
    const organisation = getPropsFromObject(item,columsForCreate)

    const url = '/api/v1/organisation'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(organisation)
    })

    if (resp.status === 201) {
      // we need to return id of created record
      // it can be extracted from header.location
      const id = resp.headers.get('location')?.split('.')[1]
      if (id &&
        item?.logo_b64 &&
        item?.logo_mime_type) {
        const base64 = item?.logo_b64.split(',')[1]
        const resp = await uploadOrganisationLogo({
          id,
          data: base64,
          mime_type: item.logo_mime_type,
          token
        })
        if (resp.status === 200) {
          return {
            status: 201,
            message: id
          }
        } else {
          return {
            status: 206,
            message: id
          }
        }
      } else {
        return {
          status: 201,
          message: id
        }
      }
    } else {
      return extractReturnMessage(resp)
    }
  } catch (e:any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateOrganisation({item, token}:
  { item: EditOrganisation, token: string }) {
  try {
    // extract only required items
    const organisation = getPropsFromObject(item, columsForUpdate)

    const url = `/api/v1/organisation?id=eq.${item.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(organisation)
    })

    if ([200,204].includes(resp.status) &&
      item?.logo_b64 &&
      item?.logo_mime_type &&
      item?.id) {
      const base64 = item?.logo_b64.split(',')[1]
      const resp = await uploadOrganisationLogo({
        id: item.id,
        data: base64,
        mime_type: item.logo_mime_type,
        token
      })
      return resp
    }
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteOrganisation({uuid,logo_id, token}:
  { uuid: string, logo_id:string|null, token: string }) {
  try {

    // delete logo first
    if (logo_id) {
      const resp = await deleteOrganisationLogo({
        id: logo_id,
        token
      })
      // debugger
      if (resp.status !== 200) {
        return resp
      }
    }

    // delete organisation
    const url = `/api/v1/organisation?id=eq.${uuid}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    // debugger
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function uploadOrganisationLogo({id, data, mime_type, token}:
  { id: string, data: string, mime_type: string, token: string }) {
  try {
    const url = '/api/v1/logo_for_organisation'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        organisation:id,
        data,
        mime_type
      })
    })
    await fetch(`/image/rpc/get_logo?id=${id}`, {cache: 'reload'})
    // @ts-ignore
    location.reload(true)
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteOrganisationLogo({id, token}:
  { id: string, token: string }) {
  try {
    const url = `/api/v1/logo_for_organisation?organisation=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getRsdPathForOrganisation({uuid,token,frontend = false}:
  {uuid: string, token?: string, frontend?: boolean}) {
  try {
    const query = `rpc/organisation_route?id=${uuid}`
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url =`/api/v1/${query}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.status === 200) {
      const json: {organisation: string, rsd_path: string} = await resp.json()
      return {
        status: 200,
        message: json.rsd_path
      }
    }
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export function getUrlFromLogoId(logo_id: string|null|undefined) {
  if (logo_id) {
    return `/image/rpc/get_logo?id=${logo_id}`
  }
  return null
}

export function searchToEditOrganisation({item, account, position}:
  { item: SearchOrganisation, account?: string, position?: number }) {

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
}

export function updateDataObjectAfterSave({data, id}:
  {data: EditOrganisation, id: string}) {
  // update local data
  if (id) data.id = id
  // if base64 image is present
  if (data.logo_b64) {
    // it is uploaded and uses id
    data.logo_id = id
    // remove image strings after upload
    data.logo_b64 = null
    data.logo_mime_type = null
  }
  return data
}

type NewOrganisation = {
  name: string
  position: number
  primary_maintainer: string | null
  role?: OrganisationRole
  is_tenant?: boolean
  parent?: string | null
}

export function newOrganisationProps(props: NewOrganisation) {
  const initOrg = {
    id: null,
    parent: props?.parent ?? null,
    name: props.name,
    is_tenant: props?.is_tenant ?? false,
    slug: null,
    ror_id: null,
    position: props.position,
    logo_b64: null,
    logo_mime_type: null,
    logo_id: null,
    website: null,
    source: 'MANUAL' as 'MANUAL',
    primary_maintainer: props.primary_maintainer,
    role: props?.role ?? 'participating',
    canEdit: false,
    description: null
  }
  return initOrg
}
