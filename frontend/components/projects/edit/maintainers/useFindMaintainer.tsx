import {useState, useEffect} from 'react'
import {AutocompleteOption} from '~/types/AutocompleteOptions'

import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {MaintainerOfProject} from './useProjectMaintainer'

export async function findMaintainerByName({searchFor, token,frontend=true}:
  {searchFor: string,token:string,frontend?:boolean}) {
  try {
    const query = `login_for_account?name=ilike.*${searchFor}*`
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
    logger(`findMaintainerByName: ${resp.status}:${resp.statusText}`, 'warn')
    return []
  } catch (e:any) {
    logger(`findMaintainerByName: ${e?.message}`, 'error')
    return []
  }
}

export function maintainersToOptions(maintainers:MaintainerOfProject[]) {
  return maintainers.map(item => ({
    key: item.email,
    label: item.name,
    data: item
  }))
}


export default function useFindMaintainer({searchFor, token}:
  {searchFor: string,token:string}) {
  const [options, setOptions] = useState<AutocompleteOption<MaintainerOfProject>[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let abort = false
    async function findMaintainer() {
      setLoading(true)
      const resp = await findMaintainerByName({
        searchFor,
        token
      })
      debugger
      const options = maintainersToOptions(resp)
      if (abort) return
      setOptions(options)
      setLoading(false)
    }
    if (searchFor && token) {
      findMaintainer()
    }
    ()=>{abort=true}
  },[searchFor,token])

  return {
    loading,
    options
  }
}
