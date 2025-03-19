// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useMemo,useState} from 'react'

import {useSession} from '~/auth'
import {ProjectOfOrganisation} from '~/types/Organisation'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {getProjectsForOrganisation} from '../apiOrganisations'
import useProjectParams from './useProjectParams'
import useOrganisationContext from '../context/useOrganisationContext'
import {getProjectOrderOptions} from './filters/OrgOrderProjectsBy'


type State = {
  count: number,
  data: ProjectOfOrganisation[]
}

export default function useOrganisationProjects() {
  const {token} = useSession()
  const {id,isMaintainer} = useOrganisationContext()
  const {
    search, keywords_json, domains_json, organisations_json,
    project_status, categories_json, order, page, rows
  } = useProjectParams()
  // we need to memo orderOptions array to avoid useEffect dependency loop
  const orderOptions = useMemo(()=>getProjectOrderOptions(isMaintainer),[isMaintainer])

  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    let orderBy='slug.asc'

    async function getProjects() {
      if (id) {
        // set loading start
        setLoading(true)

        if (order) {
          // extract order direction from definitions
          const orderInfo = orderOptions.find(item=>item.key===order)
          // ordering options require "stable" secondary order
          // to ensure proper pagination. We use slug for this purpose
          if (orderInfo) orderBy=`${order}.${orderInfo.direction},slug.asc`
        }

        const projects: State = await getProjectsForOrganisation({
          organisation: id,
          searchFor: search ?? undefined,
          project_status: project_status ?? undefined,
          keywords: decodeJsonParam(keywords_json,null),
          domains: decodeJsonParam(domains_json,null),
          organisations: decodeJsonParam(organisations_json,null),
          categories: decodeJsonParam(categories_json, null),
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
        // set loading done
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
    id, token, isMaintainer, orderOptions,
    project_status, categories_json
  ])

  return {
    projects:state.data,
    count:state.count,
    loading
  }
}
