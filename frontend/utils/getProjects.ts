import {ProjectItem} from '../types/ProjectItem'
import {extractCountFromHeader} from './extractCountFromHeader'
import logger from './logger'

// TODO! update url to new db and setup variable endpoint based on environment
export async function getProjectList({limit=12,offset=0,baseUrl='/api/v1',}:
  {limit:number,offset:number,baseUrl?:string,}
){
  try{
    const url = `${baseUrl}/project?order=updated_at.desc&limit=${limit}&offset=${offset}`
    const headers = new Headers()
    // console.log(`getSoftwareList...url...`,url)
    // request estimated count - faster method
    headers.append('Prefer','count=exact')
    const resp = await fetch(url,{method:'GET', headers})

    if ([200,206].includes(resp.status)){
      const data:ProjectItem[] = await resp.json()
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

// TODO! update url to new db and setup variable endpoint based on environment
export async function getProjectItem(slug:string){
  try{
    // legacy backed url
    // const url=`https://www.research-software.nl/api/project/${slug}`
    const url = `${process.env.POSTGREST_URL}/project?slug=eq.${slug}`
    const resp = await fetch(url,{method:'GET'})
    if (resp.status===200){
      const data:ProjectItem[] = await resp.json()
      return data
    }
  }catch(e:any){
    // console.log("getProject...failed:", e)
    logger(`getProjectItem: ${e?.message}`,'error')
    // return []
  }
}
