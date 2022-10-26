// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {Session} from '~/auth'
import SoftwareGrid from '~/components/software/SoftwareGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useUserSoftware from './useUserSoftware'

export default function UserSoftware({session}: { session: Session }) {
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Filter software')
  const {loading, software, count} = useUserSoftware({
    searchFor,
    page,
    rows,
    session
  })

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  return (
    <SoftwareGrid
      software={software}
      className="gap-[0.125rem] pt-4 pb-12"
    />
  )
}
