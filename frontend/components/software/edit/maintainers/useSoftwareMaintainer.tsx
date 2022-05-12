import {useState,useEffect} from 'react'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type RawMaintainerOfSoftware = {
  // unique maintainer id
  maintainer: string
  name: string[]
  email: string[]
  affiliation: string[],
}

export type MaintainerOfSoftware = {
  // unique maintainer id
  account: string
  name: string
  email: string
  affiliation: string,
}

export async function getMaintainersOfSoftware({software, token, frontend=true}:
  {software: string, token: string,frontend?:boolean}) {
  try {
    let query = `rpc/maintainers_of_software?software_id=${software}`
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json:RawMaintainerOfSoftware[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfSoftware: ${resp.status}:${resp.statusText} software: ${software}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfSoftware: ${e?.message}`, 'error')
    return []
  }
}

export default function useSoftwareMaintainers({software, token}:
  {software: string, token: string }) {
  const [maintainers, setMaintainers] = useState<MaintainerOfSoftware[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      setLoading(true)
      const raw_maintainers = await getMaintainersOfSoftware({
        software,
        token,
        frontend:true
      })
      const maintainers = rawMaintainersToMaintainers(raw_maintainers)
      if (abort) return null
      // update maintainers state
      setMaintainers(maintainers)
      // update loading flag
      setLoading(false)
    }

    if (software && token) {
      getMaintainers()
    }

    ()=>{abort=true}
  },[software,token])

  return {maintainers, loading}
}

export function rawMaintainersToMaintainers(raw_maintainers: RawMaintainerOfSoftware[]) {
  try {
    const maintainers:MaintainerOfSoftware[] = []
    raw_maintainers.forEach(item => {
      // use name as second loop indicator
      item.name.forEach((name, pos) => {
        const maintainer = {
          account: item.maintainer,
          name,
          email: item.email[pos] ? item.email[pos] : '',
          affiliation: item.affiliation[pos] ? item.affiliation[pos] : ''
        }
        maintainers.push(maintainer)
      })
    })
    return maintainers
  } catch (e:any) {
    logger(`rawMaintainersToMaintainers: ${e?.message}`,'error')
    return []
  }
}


export async function deleteMaintainerFromSoftware({maintainer,software,token,frontend=true}:
  {maintainer:string,software:string,token:string,frontend?:boolean}) {
  try {
    let query = `maintainer_for_software?maintainer=eq.${maintainer}&software=eq.${software}`
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }

    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`deleteMaintainerFromSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function softwareMaintainerLink({software, account, token}:
  { software: string, account: string, token: string }) {
  try {
    // POST
    const url = '/api/v1/invite_maintainer_for_software'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        software,
        created_by:account
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/software/${id}`
        return {
          status: 201,
          message: link
        }
      }
      return {
        status: 400,
        message: 'Id is missing'
      }
    }
    return extractReturnMessage(resp, software ?? '')
  } catch (e: any) {
    logger(`createMaintainerLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
