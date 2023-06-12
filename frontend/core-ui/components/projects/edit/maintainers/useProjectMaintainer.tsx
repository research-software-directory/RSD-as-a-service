// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type RawMaintainerOfProject = {
  // unique maintainer id
  maintainer: string
  name: string[]
  email: string[]
  affiliation: string[],
}

export type MaintainerOfProject = {
  // unique maintainer id
  account: string
  name: string
  email: string
  affiliation: string,
}

export async function getMaintainersOfProject({project, token, frontend=true}:
  {project: string, token: string,frontend?:boolean}) {
  try {
    let query = `rpc/maintainers_of_project?project_id=${project}`
    let url = `/api/v1/${query}`
    if (frontend === false) {
      url = `${process.env.POSTGREST_URL}/${query}`
    }

    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })

    if (resp.status === 200) {
      const json:RawMaintainerOfProject[] = await resp.json()
      return json
    }
    // ERRORS
    logger(`getMaintainersOfSoftware: ${resp.status}:${resp.statusText} project: ${project}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getMaintainersOfSoftware: ${e?.message}`, 'error')
    return []
  }
}

export default function useProjectMaintainers({project, token}:
  {project: string, token: string }) {
  const [maintainers, setMaintainers] = useState<MaintainerOfProject[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedProject, setLoadedProject] = useState('')

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      setLoading(true)
      const raw_maintainers = await getMaintainersOfProject({
        project,
        token,
        frontend:true
      })
      const maintainers = rawMaintainersToMaintainers(raw_maintainers)
      if (abort) return null
      // update maintainers state
      setMaintainers(maintainers)
      setLoadedProject(project)
      // update loading flag
      setLoading(false)
    }

    if (project && token && project!==loadedProject) {
      getMaintainers()
    }
    return ()=>{abort=true}
  },[project,token,loadedProject])

  return {
    maintainers,
    loading
  }
}

export function rawMaintainersToMaintainers(raw_maintainers: RawMaintainerOfProject[]) {
  try {
    const maintainers:MaintainerOfProject[] = []
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

export async function deleteMaintainerFromProject({maintainer,project,token,frontend=true}:
  {maintainer:string,project:string,token:string,frontend?:boolean}) {
  try {
    let query = `maintainer_for_project?maintainer=eq.${maintainer}&project=eq.${project}`
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
    logger(`deleteMaintainerFromProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
