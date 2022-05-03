import {useState,useEffect} from 'react'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'


export type MaintainerOfProject = {
  slug: string
  name: string
  email: string
  affiliation: string,
  // NOTE! image not avaliable at the moment
  avatar_url?:string
}

export async function getMaintainersOfProject({slug, token, frontend=true}:
  {slug: string, token: string,frontend?:boolean}) {
  try {
    let query = `rpc/maintainers_of_project?slug=eq.${slug}&order=name.asc`
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json:MaintainerOfProject[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfSoftware: ${resp.status}:${resp.statusText} slug: ${slug}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfSoftware: ${e?.message}`, 'error')
    return []
  }
}

export default function useProjectMaintainers({slug, token}: { slug: string, token: string }) {
  const [maintainers, setMaintainers] = useState<MaintainerOfProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      setLoading(true)
      const maintainers = await getMaintainersOfProject({
        slug,
        token,
        frontend:true
      })
      if (abort) return null
      // update maintainers state
      setMaintainers(maintainers)
      // update loading flag
      setLoading(false)
    }

    if (slug && token) {
      getMaintainers()
    }

    ()=>{abort=true}
  },[slug,token])

  return {maintainers, loading}
}
