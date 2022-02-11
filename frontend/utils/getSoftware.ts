import {SoftwareItem,Tag} from '../types/SoftwareTypes'
import {SoftwareCitationInfo} from '../types/SoftwareCitation'
import {extractCountFromHeader} from './extractCountFromHeader'
import logger from './logger'
import {MentionType} from '../types/MentionType'
import {Contributor} from '../types/Contributor'
import {Testimonial} from '../types/Testimonial'
import {createHeaders} from './editSoftware'

/**
 * postgREST api uri to retreive software index data.
 * Note! url should contain all query params. Use softwareUrl helper fn to construct url.
 * @param url with all query params for search,filtering, order and pagination
 * @returns {
  * count:number,
  * data:[]
 * }
 */
export async function getSoftwareList(url:string){
  try{
    const headers = new Headers()
    // request count for pagination
    headers.append('Prefer','count=exact')
    const resp = await fetch(url,{method:'GET', headers})

    if ([200,206].includes(resp.status)){
      const data:SoftwareItem[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers),
        data
      }
    } else{
      logger(`getSoftwareList failed: ${resp.status} ${resp.statusText}`, 'warn')
      return {
        count:0,
        data:[]
      }
    }
  }catch(e:any){
    logger(`getSoftwareList: ${e?.message}`,'error')
    return {
      count:0,
      data:[]
    }
  }
}

// query for software item page based on slug
export async function getSoftwareItem(slug:string|undefined, token?:string){
  try {
    // console.log('token...', token)
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/software?select=*,repository_url!left(url)&slug=eq.${slug}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createHeaders(token)
      })
    } else {
      resp = await fetch(url,{method:'GET'})
    }
    if (resp.status===200){
      const data:SoftwareItem[] = await resp.json()
      return data[0]
    }
  }catch(e:any){
    logger(`getSoftwareItem: ${e?.message}`,'error')
  }
}

// Get
export type TagItem={
  count: number
  tag:string
  active:boolean
}
export async function getTagsWithCount(){
  try{
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/count_software_per_tag?order=tag.asc`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:TagItem[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getTagsWithCount: 404 [${url}]`,'error')
      // query not found
      return []
    }
  }catch(e:any){
    logger(`getTagsWithCount: ${e?.message}`,'error')
    return []
  }
}


/**
 * CITATIONS
 * @param uuid
 * @returns SoftwareCitationInfo
 */

export async function getCitationsForSoftware(uuid:string,token?:string){
  try{
    // this request is always perfomed from backend
    // the release content is order by date_published
    const url = `${process.env.POSTGREST_URL}/release?select=*,release_content(*)&software=eq.${uuid}&release_content.order=date_published.desc`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createHeaders(token)
    })
    if (resp.status===200){
      const data: SoftwareCitationInfo[] = await resp.json()
      // console.log('data...', data)
      if (data.length > 0) {
        return data[0]
      }
      return null
    } else if (resp.status===404){
      logger(`getReleasesForSoftware: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getReleasesForSoftware: ${e?.message}`,'error')
    return null
  }
}


export async function getTagsForSoftware(uuid:string,frontend?:boolean,token?:string){
  try{
    // this request is always perfomed from backend
    // the content is order by tag ascending
    let url = `${process.env.POSTGREST_URL}/tag_for_software?software=eq.${uuid}&order=tag.asc`
    if (frontend === true) {
      url = `/api/v1/tag_for_software?software=eq.${uuid}&order=tag.asc`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createHeaders(token)
    })
    if (resp.status===200){
      const data:Tag[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getTagsForSoftware: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getTagsForSoftware: ${e?.message}`,'error')
    return null
  }
}

/**
 * LICENSE
 */

export type License = {
  id:string
  software:string
  license: string
}

export async function getLicenseForSoftware(uuid:string,frontend?:boolean,token?:string){
  try{
    // this request is always perfomed from backend
    // the content is order by license ascending
    let url = `${process.env.POSTGREST_URL}/license_for_software?&software=eq.${uuid}&order=license.asc`
    if (frontend === true) {
      url = `/api/v1/license_for_software?&software=eq.${uuid}&order=license.asc`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createHeaders(token)
    })
    if (resp.status===200){
      const data:License[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getLicenseForSoftware: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getLicenseForSoftware: ${e?.message}`,'error')
    return null
  }
}

/**
 * Contributors and mentions counts
 */

export type ContributorMentionCount = {
  id: string
  contributor_cnt: number | null
  mention_cnt: number | null
}

export async function getContributorMentionCount(uuid:string){
  try{
    // this request is always perfomed from backend
    // the content is order by id ascending
    const url = `${process.env.POSTGREST_URL}/count_software_contributors_mentions?id=eq.${uuid}`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data: ContributorMentionCount[] = await resp.json()
      if (data.length > 0) {
        return data[0]
      }
      return null
    } else if (resp.status===404){
      logger(`getContributorMentionCount: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getContributorMentionCount: ${e?.message}`,'error')
    return null
  }
}

/**
 * MENTIONS
 * @param uuid
 */

export type Mention = {
  date: string,
  is_featured: boolean,
  title: string,
  type: MentionType,
  url: string,
  // url to external image
  image: string,
  author: string,
  mention_for_software?:any[]
}

export async function getMentionsForSoftware(uuid: string) {
  try {
    // this request is always perfomed from backend
    // the content is order by type ascending
    const url = `${process.env.POSTGREST_URL}/mention?select=date,is_featured,title,type,url,image,author,mention_for_software!inner(software)&mention_for_software.software=eq.${uuid}&order=type.asc`
    const resp = await fetch(url, {method: 'GET'})
    if (resp.status === 200) {
      const data: ContributorMentionCount[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getMentionsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return undefined
    }
  } catch (e: any) {
    logger(`getMentionsForSoftware: ${e?.message}`, 'error')
    return undefined
  }
}

/**
 * TESTIMONIALS
 */
export async function getTestimonialsForSoftware(uuid: string) {
  try {
    // this request is always perfomed from backend
    // the content is NOT ordered
    const url = `${process.env.POSTGREST_URL}/testimonial?software=eq.${uuid}`
    const resp = await fetch(url, {method: 'GET'})
    if (resp.status === 200) {
      const data: Testimonial[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getTestimonialsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return []
    }
  } catch (e: any) {
    logger(`getTestimonialsForSoftware: ${e?.message}`, 'error')
    return []
  }
}

/**
 * CONTRIBUTORS
 */

export async function getContributorsForSoftware(uuid: string) {
  try {
    // this request is always perfomed from backend
    // the content is order by family_names ascending
    const columns = 'id,software,is_contact_person,email_address,family_names,given_names,avatar_mime_type'
    const url = `${process.env.POSTGREST_URL}/contributor?select=${columns}&software=eq.${uuid}&order=family_names.asc`
    const resp = await fetch(url, {method: 'GET'})
    if (resp.status === 200) {
      const data: Contributor[] = await resp.json()
      return data
    } else if (resp.status === 404) {
      logger(`getContributorsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return undefined
    }
  } catch (e: any) {
    logger(`getContributorsForSoftware: ${e?.message}`, 'error')
    return undefined
  }
}

/**
 * RELATED TOOLS
 */

export type RelatedTools = {
  origin:string,
  software: {
    id: string
    slug: string
    brand_name: string
    short_statement: string|null
  }
}

export async function getRelatedToolsForSoftware(uuid: string) {
  try {
    // this request is always perfomed from backend
    // the content is order by family_names ascending
    const select = 'origin,relation,software!software_for_software_relation_fkey(id,slug,brand_name,short_statement)'
    const url = `${process.env.POSTGREST_URL}/software_for_software?select=${select}&&origin=eq.${uuid}&status=eq.approved`
    const resp = await fetch(url, {method: 'GET'})
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

/**
 * REMOTE MARKDOWN FILE
 */
export async function getRemoteMarkdown(url: string) {
  try {
    const resp = await fetch(url)
    // debugger
    if (resp?.status === 200) {
      const markdown = await resp.text()
      return markdown
    }
    if ([400,404].includes(resp.status)) {
      return ({
        status: resp.status,
        message: 'Markdown file not found. Validate url.'
      })
    } else {
      // create error
      return ({
        status: resp.status ?? 404,
        message: resp?.statusText ?? 'Markdown file not found.'
      })
    }
  } catch (e: any) {
    logger(`getRemoteMarkdown: ${e?.message}`, 'error')
    return {
      status: 404,
      message: e?.message
    }
  }
}
