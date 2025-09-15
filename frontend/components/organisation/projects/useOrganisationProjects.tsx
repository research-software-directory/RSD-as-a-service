// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {ProjectOfOrganisation} from '~/types/Organisation'
import {decodeJsonParam} from '~/utils/extractQueryParam'
import {getProjectsForOrganisation} from '../apiOrganisations'
import useProjectParams from './useProjectParams'
import useOrganisationContext from '../context/useOrganisationContext'
import {getOrganisationProjectsOrder} from './filters/OrgProjectOrderOptions'


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

  const [state, setState] = useState<State>({
    count: 0,
    data: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getProjects() {
      if (id) {
        // set loading start
        setLoading(true)

        const orderBy=getOrganisationProjectsOrder(isMaintainer,order)

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
    id, token, isMaintainer, project_status,
    categories_json
  ])

  return {
    projects:state.data,
    count:state.count,
    loading
  }
}
