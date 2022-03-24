import {extractCountFromHeader} from './extractCountFromHeader'
import {createJsonHeaders} from './fetchHelpers'
import logger from './logger'


export function organisationUrl({search, rows = 12, page = 0}:
  { search: string | undefined, rows: number, page: number }) {
  // by default order is on software count and name
  let url = `${process.env.POSTGREST_URL}/organisations_overview?order=software_cnt.desc,name.asc`
  if (search) {
    url+=`&or=(name.ilike.*${search}*,website.ilike.*${search}*)`
  }
  if (rows) {
    url +=`&limit=${rows}`
  }
  if (page) {
    url +=`&offset=${page * rows}`
  }
  return url
}

export async function getOrganisationsList({search,rows,page,token}:
  { search: string|undefined,rows:number,page:number,token: string|undefined}) {
  try {
    const url = organisationUrl({search,rows,page})
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer':'count=exact'
      },
    })

    if (resp.status === 200) {
      const json = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers),
        data: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareList failed: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  } catch (e: any) {
    logger(`getOrganisationsList: ${e?.message}`, 'error')
    return {
      count: 0,
      data: []
    }
  }
}
