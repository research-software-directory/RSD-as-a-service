import {SoftwareItem} from '../types/SoftwareItem'
import {extractCountFromHeader} from './extractCountFromHeader'
import logger from "./logger"

// TODO! update url to new db and setup variable endpoint based on environment
export async function getSoftwareList({limit=12,offset=0,baseUrl="/api/v1",}:
  {limit:number,offset:number,baseUrl?:string,}
){
  try{
    const url = `${baseUrl}/software?order=updated_at.desc&limit=${limit}&offset=${offset}`
    const headers = new Headers()
    // console.log(`getSoftwareList...url...`,url)
    // request estimated count - faster method
    // headers.append('Prefer','count=estimated')
    headers.append('Prefer','count=exact')
    const resp = await fetch(url,{method:"GET", headers})

    if ([200,206].includes(resp.status)){
      const data:SoftwareItem[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers),
        data
      }
    } else{
      logger(`getSoftwareList failed: ${resp.status} ${resp.statusText}`, "warn")
      return {
        count:0,
        data:[]
      }
    }
  }catch(e:any){
    logger(`getSoftwareList: ${e?.message}`,"error")
    return {
      count:0,
      data:[]
    }
  }
}

// TODO! update url to new db and setup variable endpoint based on environment
export async function getSoftwareItem(slug:string){
  try{
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/software?slug=eq.${slug}`
    const resp = await fetch(url,{method:"GET"})
    if (resp.status===200){
      const data:SoftwareItem[] = await resp.json()
      return data
    }
  }catch(e:any){
    logger(`getSoftwareItem: ${e?.message}`,"error")
  }
}