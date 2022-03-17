import isMaintainerOfOrganisation from '../auth/permissions/isMaintainerOfOrganisation'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {
  EditOrganisation, Organisation,
  OrganisationsForSoftware, SearchOrganisation, SoftwareForOrganisation
} from '../types/Organisation'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import {getPropsFromObject} from './getPropsFromObject'
import {findInRORByName} from './getROR'
import {getSlugFromString} from './getSlugFromString'
import logger from './logger'
import {optionsNotInReferenceList} from './optionsNotInReferenceList'

// organisation colums used in editOrganisation.getOrganisationsForSoftware
const columsForSelect = 'id,slug,primary_maintainer,name,ror_id,logo_id,is_tenant,website'
// organisation colums used in editOrganisation.createOrganisation
const columsForCreate = [
  'slug', 'primary_maintainer', 'name', 'ror_id', 'logo_id', 'is_tenant', 'website'
]
// organisation colums used in editOrganisation.updateOrganisation
const columsForUpdate = [
  'id',
  ...columsForCreate
]

export async function searchForOrganisation({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }) {
  try {
    // make requests to RSD and ROR
    const [rsdOptions, rorOptions] = await Promise.all([
      findRSDOrganisation({searchFor, token, frontend}),
      findInRORByName({searchFor})
    ])
    // create options collection
    const options = [
      ...rsdOptions,
      ...optionsNotInReferenceList({
        list: rorOptions,
        referenceList: rsdOptions,
      })
    ]
    // return all options
    return options
  } catch (e: any) {
    logger(`searchForOrganisation: ${e?.message}`, 'error')
    return []
  }
}

export async function findRSDOrganisation({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }){
  try {
    let url = `${process.env.POSTGREST_URL}/organisation?name=ilike.*${searchFor}*&limit=20`
    if (frontend) {
      url = `/api/v1/organisation?name=ilike.*${searchFor}*&limit=50`
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
          key: item?.ror_id ?? item.slug ?? item.name,
          label: item.name ?? '',
          data: {
            ...item,
            source: 'RSD'
          }
        }
      })
      return options
    } else if (resp.status === 404) {
      logger('findRSDOrganisation ERROR: 404 Not found', 'error')
      // query not found
      return []
    }
    logger(`findRSDOrganisation ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
    return []
  } catch (e:any) {
    logger(`findRSDOrganisation: ${e?.message}`, 'error')
    return []
  }
}

export async function getOrganisationsForSoftware({software,token}:{software:string,token:string}){
  try {
    const url = `/api/v1/software_for_organisation?select=software,status,organisation(${columsForSelect})&software=eq.${software}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      },
    })
    if (resp.status === 200) {
      const json:OrganisationsForSoftware[] = await resp.json()
      return json
    }
    return []
  } catch (e:any) {
    logger(`getOrganisationsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function addOrganisation({item, software, account, token}:
  { item: EditOrganisation, software: string, account: string, token: string}) {
  try {
    // 1. if not RSD organisation we need to create it first
    // and obtain organisation id for the next step
    let organisation:string
    let resp = await createOrganisation({item, token})
    if (resp.status === 201) {
      organisation = resp.message
    } else {
      throw new Error(resp.message)
    }

    // 2. add as participating organisation
    resp = await addOrganisationToSoftware({
      software,
      organisation,
      account,
      token
    })

    return resp
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

async function createOrganisation({item, token}:
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
      return {
        status: 201,
        message: id
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

    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addOrganisationToSoftware({software, organisation, account, token}:
  { software: string, organisation: string, account: string, token:string }) {
  // 2a. determine status
  let status: SoftwareForOrganisation['status'] = 'requested_by_origin'
  // check if this is organisation maintainer
  const isMaintainer = await isMaintainerOfOrganisation({
    organisation,
    account,
    token
  })
  // if maintainer we approve it automatically
  if (isMaintainer === true) status = 'approved'

  // 2b. register participating organisation for this software
  const data: SoftwareForOrganisation = {
    software,
    organisation,
    status
  }
  const url = '/api/v1/software_for_organisation'
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'return=headers-only'
    },
    body: JSON.stringify(data)
  })
  return extractReturnMessage(resp)
}

export async function deleteOrganisationFromSoftware({software, organisation, token}:
  {software: string|undefined, organisation: string, token: string }) {
  try {
    if (typeof software == 'undefined') {
      return {
        status: 400,
        message: 'Bad request. software id undefined'
      }
    }
    const url = `/api/v1/software_for_organisation?software=eq.${software}&organisation=eq.${organisation}`
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
    position
  }

  if (item.source === 'ROR') {
    // ROR item has no RSD id
    addOrganisation.id = null
    // cannot be created as tenant from this page/location
    addOrganisation.is_tenant = false
    // creator is assigned as primary maintainer
    if (account) {
      addOrganisation.primary_maintainer = account
      // it can be edited by this account
      addOrganisation.canEdit = true
      // slug is constructed
      addOrganisation.slug = getSlugFromString(item.name)
    }
  }

  if (item.source === 'RSD') {
    // validate if user can edit this item
    addOrganisation.canEdit = item.primary_maintainer === account
  }


  return addOrganisation
}
