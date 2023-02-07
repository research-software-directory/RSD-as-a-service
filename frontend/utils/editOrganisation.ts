// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {AutocompleteOption} from '../types/AutocompleteOptions'
import {
  CoreOrganisationProps,
  EditOrganisation, Organisation,
  OrganisationRole,
  OrganisationsForSoftware,
  PatchOrganisation,
  SearchOrganisation
} from '../types/Organisation'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import {getImageUrl} from './editImage'
import {findInROR} from './getROR'
import {getSlugFromString} from './getSlugFromString'
import {itemsNotInReferenceList} from './itemsNotInReferenceList'
import logger from './logger'

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
          },
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
      logo_url: getImageUrl(item.logo_id)
    }
  })
  return organisations
}

export async function createOrganisation({organisation, token}:
  { organisation: CoreOrganisationProps, token: string}) {
  try {

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
      return {
        status: 201,
        message: id
      }
      // }
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

export async function updateOrganisation({organisation, token}:
  { organisation: Organisation, token: string }) {
  try {
    const url = `/api/v1/organisation?id=eq.${organisation.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(organisation)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchOrganisation({data, token}:
  { data: PatchOrganisation, token: string }) {
  try {
    const url = `/api/v1/organisation?id=eq.${data.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
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
