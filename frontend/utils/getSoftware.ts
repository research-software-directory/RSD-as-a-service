import {SoftwareItem} from '../types/SoftwareItem'
import {extractCountFromHeader} from './extractCountFromHeader'
import logger from "./logger"
// import {softwareUrl} from './postgrestUrl'

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

// queries for software index page including search and pagination
// export async function getSoftwareList({limit=12,offset=0,baseUrl,search}:
//   {limit:number,offset:number,baseUrl:string,search?:string}
// ){
//   try{
//     // const url = `${baseUrl}/software?is_published=eq.true&order=updated_at.desc&limit=${limit}&offset=${offset}`
//     const url = softwareUrl({
//       baseUrl,
//       search,
//       columns:['id','slug','brand_name','short_statement','is_featured','updated_at'],
//       filter:"is_published=eq.true",
//       order:"is_featured.desc,updated_at.desc",
//       limit,
//       offset
//     })
//     console.log("getSoftwareList.url",url)
//     const headers = new Headers()
//     // request count for pagination
//     headers.append('Prefer','count=exact')
//     const resp = await fetch(url,{method:"GET", headers})

//     if ([200,206].includes(resp.status)){
//       const data:SoftwareItem[] = await resp.json()
//       return {
//         count: extractCountFromHeader(resp.headers),
//         data
//       }
//     } else{
//       logger(`getSoftwareList failed: ${resp.status} ${resp.statusText}`, "warn")
//       return {
//         count:0,
//         data:[]
//       }
//     }
//   }catch(e:any){
//     logger(`getSoftwareList: ${e?.message}`,"error")
//     return {
//       count:0,
//       data:[]
//     }
//   }
// }

// query for software item page based on slug
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

// Get
export type TagItem={
  count: number,
  tag:string,
  active:boolean
}
export async function getTagsWithCount(){
  try{
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/count_software_per_tag?order=tag.asc`
    const resp = await fetch(url,{method:"GET"})
    if (resp.status===200){
      const data:TagItem[] = await resp.json()
      return data
    }
  }catch(e:any){
    logger(`getTagsWithCount: ${e?.message}`,"error")
  }
}