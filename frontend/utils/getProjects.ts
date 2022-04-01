import {Project, RawProject} from '../types/Project'
import {extractCountFromHeader} from './extractCountFromHeader'
import {createJsonHeaders} from './fetchHelpers'
import {getPropsFromObject} from './getPropsFromObject'
import logger from './logger'
import {paginationUrlParams} from './postgrestUrl'

// TODO! update url to new db and setup variable endpoint based on environment
export async function getProjectList({rows=12,page=0,baseUrl='/api/v1',searchFor,token}:
  {rows: number, page: number, baseUrl?: string, searchFor?: string,token?:string}
){
  try {
    const columns = 'id,slug,title,subtitle,date_start,date_end,updated_at,is_published,image_for_project(project)'
    let url = `${baseUrl}/project?select=${columns}`
    // search
    if (searchFor) {
      url += `&or=(title.ilike.*${searchFor}*,subtitle.ilike.*${searchFor}*))`
    }
    // order, by default on updated_at descending
    url +='&order=updated_at.desc'
    // pagination
    url += paginationUrlParams({rows, page})

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if ([200,206].includes(resp.status)){
      const json: RawProject[] = await resp.json()
      const data = prepareData(json)
      return {
        count: extractCountFromHeader(resp.headers),
        data
      }
    } else{
      logger(`getProjectList failed: ${resp.status} ${resp.statusText}`, 'warn')
      return {
        count:0,
        data:[]
      }
    }
  }catch(e:any){
    logger(`getProjectList: ${e?.message}`,'error')
    return {
      count:0,
      data:[]
    }
  }
}

function prepareData(json:RawProject[]) {
  const data:Project[] = json.map(item => {
    const project = getPropsFromObject(item, [
      'id', 'slug',
      'title',
      'subtitle',
      'date_start',
      'date_end',
      'updated_at',
      'is_published'
    ])
    if (item.image_for_project && item.image_for_project.length > 0) {
      project['image_id'] = item.image_for_project[0].project
    } else {
      project['image_id'] = null
    }
    return project
  })
  return data
}

// TODO! update url to new db and setup variable endpoint based on environment
export async function getProjectItem(slug:string){
  try{
    // legacy backed url
    // const url=`https://www.research-software.nl/api/project/${slug}`
    const url = `${process.env.POSTGREST_URL}/project?slug=eq.${slug}`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:Project[] = await resp.json()
      return data
    }
  }catch(e:any){
    // console.log("getProject...failed:", e)
    logger(`getProjectItem: ${e?.message}`,'error')
    // return []
  }
}
