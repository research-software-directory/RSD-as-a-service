import {SoftwareItem} from '../types/SoftwareItem'

// TODO! update url to new db and setup variable endpoint based on environment
export async function getSoftwareList({limit,offset}:{limit:number,offset:number}){
  try{
    const url=`https://www.research-software.nl/api/software?sort=brandName&direction=asc&limit=${limit}&skip=${offset}`
    const resp = await fetch(url,{method:"GET"})
    if (resp.status===200){
      const data:SoftwareItem[] = await resp.json()
      return data
    }
    return []
  }catch(e){
    console.log("getProjects...failed:", e)
    return []
  }
}

// TODO! update url to new db and setup variable endpoint based on environment
export async function getSoftwareItem(slug:string){
  try{
    const url=`https://www.research-software.nl/api/software/${slug}`
    const resp = await fetch(url,{method:"GET"})
    if (resp.status===200){
      const data:SoftwareItem = await resp.json()
      return data
    }
    return undefined
  }catch(e){
    console.log("getProject...failed:", e)
    return undefined
  }
}