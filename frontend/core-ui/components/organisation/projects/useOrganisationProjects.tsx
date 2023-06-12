// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {ProjectOfOrganisation} from '~/types/Organisation'
import {getProjectsForOrganisation, OrganisationApiParams} from '~/utils/getOrganisations'

type State = {
  count: number,
  data: ProjectOfOrganisation[]
}

export default function useOrganisationProjects({organisation, searchFor, page, rows,isMaintainer,token}:
  OrganisationApiParams) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getProjects() {
      // set loding done
      setLoading(true)
      const projects: State = await getProjectsForOrganisation({
        organisation,
        searchFor,
        page,
        rows,
        isMaintainer,
        token
      })
      // abort
      if (abort) return
      // set state
      setState(projects)
      // set loding done
      setLoading(false)
    }

    if (organisation) {
      getProjects()
    }

    return ()=>{abort = true}
  },[searchFor,page,rows,organisation,token,isMaintainer])

  return {
    projects:state.data,
    count:state.count,
    loading
  }
}
