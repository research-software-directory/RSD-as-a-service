// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {getMaintainersOfOrganisation} from './getMaintainersOfOrganisation'

export type RawMaintainerOfOrganisation = {
  // unique maintainer id
  maintainer: string
  name: string[]
  email: string[]
  affiliation: string[],
  is_primary?: boolean
}

export type MaintainerOfOrganisation = {
  // unique maintainer id
  account: string
  name: string
  email: string
  affiliation: string,
  is_primary?: boolean
}

export default function useOrganisationMaintainers({organisation, token}:
  {organisation: string, token: string }) {
  const [maintainers, setMaintainers] = useState<MaintainerOfOrganisation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getMaintainers() {
      // console.log('useOrganisationMaintainers.useEffect.getMaintainers')
      setLoading(true)
      const raw_maintainers = await getMaintainersOfOrganisation({
        organisation,
        token,
        frontend:true
      })
      // console.log('useOrganisationMaintainers.useEffect...raw_maintainers',raw_maintainers)
      const maintainers = rawMaintainersToMaintainers(raw_maintainers)
      if (abort) return null
      // update maintainers state
      setMaintainers(maintainers)
      // update loading flag
      setLoading(false)
    }
    // console.log('useOrganisationMaintainers.useEffect...')
    if (organisation && token) {
      getMaintainers()
    } else if (token==='') {
      setLoading(false)
    }
    return ()=>{abort=true}
  }, [organisation,token])

  if (token === '') {
    return {
      loading: false,
      maintainers,
      setMaintainers
    }
  }

  // console.log('useOrganisationMaintainers.loading...', loading)
  // console.log('useOrganisationMaintainers.organisation...',organisation)
  // console.log('useOrganisationMaintainers.token...',token)
  return {
    loading,
    maintainers,
    setMaintainers
  }
}

export function rawMaintainersToMaintainers(raw_maintainers: RawMaintainerOfOrganisation[]) {
  try {
    const maintainers:MaintainerOfOrganisation[] = []
    raw_maintainers.forEach(item => {
      // use name as second loop indicator
      item.name.forEach((name, pos) => {
        const maintainer = {
          account: item.maintainer,
          name,
          email: item.email[pos] ? item.email[pos] : '',
          affiliation: item.affiliation[pos] ? item.affiliation[pos] : '',
          is_primary: item?.is_primary ?? false
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


export async function deleteMaintainerFromOrganisation({maintainer,organisation,token,frontend=true}:
  {maintainer:string,organisation:string,token:string,frontend?:boolean}) {
  try {
    let query = `maintainer_for_organisation?maintainer=eq.${maintainer}&organisation=eq.${organisation}`
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

export async function organisationMaintainerLink({organisation, account, token}:
  { organisation: string, account: string, token: string }) {
  try {
    // POST
    const url = '/api/v1/invite_maintainer_for_organisation'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify({
        organisation,
        created_by:account
      })
    })
    if (resp.status === 201) {
      const id = resp.headers.get('location')?.split('.')[1]
      if (id) {
        const link = `${location.origin}/invite/organisation/${id}`
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
    return extractReturnMessage(resp, organisation ?? '')
  } catch (e: any) {
    logger(`organisationMaintainerLink: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
