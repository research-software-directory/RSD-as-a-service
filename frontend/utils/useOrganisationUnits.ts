// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {OrganisationForOverview} from '../types/Organisation'
import {getOrganisationChildren} from './getOrganisations'

type UseOrganisationUnitsProp = {
  // searchFor?: string
  // page: number,
  // rows: number,
  organisation: string,
  token: string
}

type State = {
  count: number,
  data: OrganisationForOverview[]
}

export default function useOrganisationUnits({organisation, token}:
  UseOrganisationUnitsProp) {
  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getChildren() {
      // set loding done
      setLoading(true)
      const units: OrganisationForOverview[] = await getOrganisationChildren({
        uuid: organisation,
        token,
        frontend:true
      })
      // abort
      if (abort) return
      // set state
      setState({
        count: units.length,
        data: units
      })
      // set loding done
      setLoading(false)
    }

    if (organisation) {
      getChildren()
    }

    return () => { abort = true }
  }, [organisation, token])

  return {
    units: state.data,
    count: state.count,
    setUnits: setState,
    loading
  }
}
