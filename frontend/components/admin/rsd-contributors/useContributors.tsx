// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

import {createColumns} from './config'
import {OrderByProps} from '~/components/table/EditableTable'
import {getContributors} from './apiRsdContributors'

export type RsdContributor = {
  id: string,
  is_contact_person: boolean
  email_address: string
  family_names: string
  given_names: string
  affiliation: string
  role: string
  orcid: string
  avatar_id: string | null
  origin: 'contributor' | 'team_member'
  slug: string
  public_orcid_profile: null | string
  avatars: null | string[]
}

type useContributorsProps = {
  token: string,
  orderBy?: OrderByProps<RsdContributor, keyof RsdContributor>
}

export default function useContributors({token, orderBy}:useContributorsProps) {
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find contributor')
  const [contributors, setContributors] = useState<RsdContributor[]>([])
  const [columns] = useState(createColumns(token))
  // show loading only on inital load
  const [loading, setLoading] = useState(true)

  const loadContributors = useCallback(async () => {
    let abort = false
    const {contributors, count} = await getContributors({
      token,
      searchFor,
      page,
      rows,
      orderBy
    })

    if (abort === false) {
      if (orderBy) {
        // update columns order
        columns.forEach(col => {
          if (col.key === orderBy.column) {
            col.order = {
              active: true,
              direction: orderBy.direction
            }
          } else {
            col.order = {
              active: false,
              direction: 'asc'
            }
          }
        })
      }
      setContributors(contributors)
      setCount(count)
      setLoading(false)
    }

    return ()=>{abort=true}
  // we do not include setCount in order to avoid loop
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, searchFor, page, rows, columns, orderBy])

  useEffect(() => {
    loadContributors()
  },[loadContributors])

  return {
    loading,
    columns,
    contributors
  }
}
