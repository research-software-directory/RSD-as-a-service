// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {OrganisationForOverview} from '../../../types/Organisation'
import {getOrganisationChildren} from '../apiOrganisations'
import useOrganisationContext from '../context/useOrganisationContext'


type State = {
  count: number,
  data: OrganisationForOverview[]
}

export default function useOrganisationUnits() {
  const {token} = useSession()
  const {id, children_cnt} = useOrganisationContext()
  const [state, setState] = useState<State>({
    count: children_cnt ?? 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getChildren() {
      // set loding done
      setLoading(true)
      const units: OrganisationForOverview[] = await getOrganisationChildren({
        uuid: id ?? '',
        token
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

    if (id) {
      getChildren()
    }

    return () => { abort = true }
  }, [id, token])

  return {
    units: state.data,
    count: state.count,
    setUnits: setState,
    loading
  }
}
