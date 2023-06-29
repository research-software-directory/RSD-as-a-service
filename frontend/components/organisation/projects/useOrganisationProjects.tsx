// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useMemo,useState} from 'react'

import {useSession} from '~/auth'
import {ProjectOfOrganisation} from '~/types/Organisation'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {getProjectsForOrganisation} from '../apiOrganisations'
import useProjectParams from './useProjectParams'
import useOrganisationContext from '../context/useOrganisationContext'
import {getProjectOrderOptions} from './filters/useProjectOrderOptions'

type State = {
  count: number,
  data: ProjectOfOrganisation[]
}

export default function useOrganisationProjects() {
  const {token} = useSession()
  const {id,isMaintainer} = useOrganisationContext()
  const {search, keywords_json, domains_json, organisations_json, order, page, rows} = useProjectParams()
  // we need to memo orderOptions array to avoid useEffect dependency loop
  const orderOptions = useMemo(()=>getProjectOrderOptions(isMaintainer),[isMaintainer])

  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    let orderBy:string

    async function getProjects() {
      if (id) {
        // set loding done
        setLoading(true)

        if (order) {
          // extract order direction from definitions
          const orderInfo = orderOptions.find(item=>item.key===order)
          if (orderInfo) orderBy=`${order}.${orderInfo.direction}`
        }

        const projects: State = await getProjectsForOrganisation({
          organisation:id,
          searchFor: search ?? undefined,
          keywords: decodeJsonParam(keywords_json,null),
          domains: decodeJsonParam(domains_json,null),
          organisations: decodeJsonParam(organisations_json,null),
          order: orderBy ?? undefined,
          // api works with zero
          page:page ? page-1 : 0,
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
    }

    if (id) {
      getProjects()
    }

    return () => { abort = true }

  }, [
    search, keywords_json, domains_json,
    organisations_json, order, page, rows,
    id, token, isMaintainer, orderOptions
  ])

  return {
    projects:state.data,
    count:state.count,
    loading
  }
}
