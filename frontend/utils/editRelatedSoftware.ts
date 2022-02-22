import {AutocompleteOption, AutocompleteOptionWithLink} from '../types/AutocompleteOptions'
import {RelatedSoftware, RelatedTools, SoftwareForSoftware} from '../types/SoftwareTypes'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage} from './fetchHelpers'
import logger from './logger'

export async function getRelatedToolsForSoftware({software, token, frontend, columns ='id,slug,brand_name,short_statement'}:
  { software: string, token?: string, frontend?: boolean, columns?:string}) {
  try {
    // this request is always perfomed from backend
    const select = `origin,relation,software!software_for_software_relation_fkey(${columns})`
    let url = `${process.env.POSTGREST_URL}/software_for_software?select=${select}&origin=eq.${software}`
    if (frontend) {
      url = `/api/v1/software_for_software?select=${select}&origin=eq.${software}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: RelatedTools[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getRelatedToolsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return []
    }
  } catch (e: any) {
    logger(`getRelatedToolsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function getRelatedSoftwareList({software, token}:{
  software: string, token?: string
}) {
  try {
    const url = `/api/v1/software?select=id,slug,brand_name&id=neq.${software}&order=brand_name.asc`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json: RelatedSoftware[] = await resp.json()
      return json
    } else {
      return []
    }
  } catch (e:any) {
    logger(`getRelatedSoftwareList: ${e?.message}`, 'error')
    return []
  }
}

type SaveRelatedSoftware = {
  software: string
  relatedSoftware: AutocompleteOption<RelatedSoftware>[]
  referenceList: AutocompleteOption<RelatedSoftware>[]
  token:string
}

export async function saveRelatedSoftware({software, relatedSoftware, referenceList, token}: SaveRelatedSoftware) {
  const requests = []
  // extract items to delete
  const toDelete = itemsNotInReferenceList({
    list: referenceList, referenceList: relatedSoftware
  })
  if (toDelete.length > 0) {
    requests.push(deleteRelatedSoftwareByIds({
      origin: software,
      relations: toDelete.map(item => item.key),
      token
    }))
  }
  // extract items to add
  const toAdd = itemsNotInReferenceList({
    list: relatedSoftware, referenceList
  })
  if (toAdd?.length > 0) {
    const addRelated = toAdd.map(item => {
      return {
        origin: software,
        relation: item.key
      }
    })
    requests.push(addRelatedSoftware({
      relatedSoftware: addRelated,
      token
    }))
  }
  const responses = await Promise.all(requests)
  const errors = extractErrorMessages(responses)
  // on error exit
  if (errors.length > 0) {
    // return first error
    return errors[0]
  } else {
    return {
      status: 200,
      message: 'OK'
    }
  }
}


export async function addRelatedSoftware({relatedSoftware, token}: {
  relatedSoftware:SoftwareForSoftware[], token:string
}) {
  const url = '/api/v1/software_for_software'

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(relatedSoftware)
  })

  return extractReturnMessage(resp)
}

export async function deleteRelatedSoftwareByIds({origin, relations,token}: { origin:string, relations:string[],token:string}) {

  const url = `/api/v1/software_for_software?origin=eq.${origin}&relation=in.("${relations.join('","')}")`

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  return extractReturnMessage(resp)
}


export function relatedSoftwareToOptions(software: RelatedSoftware[] | undefined): AutocompleteOption<RelatedSoftware>[] {
  if (typeof software == 'undefined') return []
  const options = software.map(item => {
    return {
      key: item.id,
      label: item.brand_name,
      data: item
    }
  })
  return options
}

export function relatedSoftwareToOptionsWithLink(software: RelatedSoftware[] | undefined): AutocompleteOptionWithLink<RelatedSoftware>[] {
  if (typeof software == 'undefined') return []
  const options = software.map(item => {
    return {
      key: item.id,
      label: item.brand_name,
      link: `/software/${item.slug}`,
      data: item
    }
  })
  return options
}

export function relatedToolsToOptions(software: RelatedTools[] | undefined) {
  if (typeof software == 'undefined') return []
  const options:AutocompleteOption<RelatedSoftware>[] = []
  software.forEach(item => {
    if (item?.software?.id) {
      options.push({
        key: item?.software?.id,
        label: item?.software?.brand_name,
        data: item?.software
      })
    }
  })
  return options
}

export function relatedToolsToOptionsWithLink(software: RelatedTools[] | undefined) {
  if (typeof software == 'undefined') return []
  const options: AutocompleteOptionWithLink<RelatedSoftware>[] = []
  software.forEach(item => {
    if (item?.software?.id) {
      options.push({
        key: item?.software?.id,
        label: item?.software?.brand_name,
        link: `/software/${item?.software?.slug}`,
        data: item?.software
      })
    }
  })
  return options
}


export function itemsNotInReferenceList({list, referenceList}:
  { list: AutocompleteOption<RelatedSoftware>[], referenceList: AutocompleteOption<RelatedSoftware>[] }) {
  if (list.length > 0) {
    // list in initalList not present in saveList should be removed from db
    const itemsNotInReferenceList = list.filter(({data: {id: lId}}) => {
      // if item cannot be found in saveList
      return !referenceList.some(({data: {id: rId}}) => {
        // compare inital item with items in saveList
        return lId === rId
      })
    })
    return itemsNotInReferenceList
  }
  return []
}
