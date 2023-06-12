// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {SoftwareOfOrganisation} from '../types/Organisation'
import {getSoftwareForOrganisation, OrganisationApiParams} from './getOrganisations'

type State = {
  count: number,
  data: SoftwareOfOrganisation[]
}

export default function useOrganisationSoftware({organisation, searchFor, page, rows,isMaintainer,token}:
  OrganisationApiParams) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getSoftware() {
      // set loding done
      setLoading(true)
      const software:State = await getSoftwareForOrganisation({
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
      setState(software)
      // set loding done
      setLoading(false)
    }

    if (organisation) {
      getSoftware()
    }

    return ()=>{abort = true}
  },[searchFor,page,rows,organisation,token,isMaintainer])

  return {
    software:state.data,
    count:state.count,
    loading
  }
}
