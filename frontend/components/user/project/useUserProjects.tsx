// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'

import {useSession} from '~/auth'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type ProjectByMaintainer={
  id: string
	slug: string,
	title: string,
	subtitle: string | null
	current_state: string
	date_start: string
  date_end: string
	updated_at: string
	is_published: boolean
	image_contain: boolean,
	image_id: string | null
	impact_cnt: number
	output_cnt: number
}

type UserProjectsProp = {
  searchFor?: string
  page: number,
  rows: number,
  account: string
  token?: string,
}

export async function getProjectsForMaintainer(
  {searchFor, page, rows, token, account}: UserProjectsProp
) {
  try {
    // baseUrl
    let url = `/api/v1/rpc/projects_by_maintainer?maintainer_id=${account}&order=is_published.desc,title`

    // search
    if (searchFor) {
      url += `&or=(title.ilike.*${encodeURIComponent(searchFor)}*, subtitle.ilike.*${encodeURIComponent(searchFor)}*)`
    }

    // pagination
    url += paginationUrlParams({rows, page})

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if ([200, 206].includes(resp.status)) {
      const json: ProjectByMaintainer[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        projects: json
      }
    }

    // otherwise request failed
    logger(`getProjectsForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')

    // we log and return zero
    return {
      count: 0,
      projects: []
    }
  } catch (e: any) {
    // otherwise request failed
    logger(`getProjectsForMaintainer: ${e.message}`, 'error')

    // we log and return zero
    return {
      count: 0,
      projects: []
    }
  }
}

type UseUserProjectsProps={
  searchFor?: string
  page: number
  rows: number
}

type UserProjects = {
  count: number,
  projects: ProjectByMaintainer[]
}


export default function useUserProjects({searchFor,page,rows}:UseUserProjectsProps) {
  const {user,token} = useSession()
  const [state, setState] = useState<UserProjects>({
    count: 0,
    projects: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false

    async function getProjects() {
      const projects = await getProjectsForMaintainer({
        searchFor,
        page,
        rows,
        token,
        account: user?.account ?? ''
      })

      if (abort) {
        return
      }

      // set state
      setState(projects)
      // set loading done
      setLoading(false)
    }

    if (token && user?.account) {
      getProjects()
    }

    return () => {abort = true}

  }, [searchFor, page, rows, token, user?.account])

  return {
    ...state,
    loading
  }
}
