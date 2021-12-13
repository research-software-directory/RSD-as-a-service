import {ProjectItem} from '../types/ProjectItem'

// TODO! update url to new db and setup variable endpoint based on environment
export async function getProjects({limit,offset}:{limit:number,offset:number}){
  try{
    const url=`https://www.research-software.nl/api/project?sort=title&direction=asc&limit=${limit}&skip=${offset}`
    const resp = await fetch(url,{method:"GET"})
    if (resp.status===200){
      const data:ProjectItem[] = await resp.json()
      return data
    }
    return []
  }catch(e){
    console.log("getProjects...failed:", e)
    return []
  }
}

// TODO! update url to new db and setup variable endpoint based on environment
export async function getProject(slug:string){
  try{
    const url=`https://www.research-software.nl/api/project/${slug}`
    const resp = await fetch(url,{method:"GET"})
    if (resp.status===200){
      const data:ProjectItem = await resp.json()
      return data
    }
    return undefined
  }catch(e){
    console.log("getProject...failed:", e)
    return undefined
  }
}