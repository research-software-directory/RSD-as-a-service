// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {Session} from '~/auth'
import SoftwareGrid from '~/components/software/SoftwareGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useUserSoftware from './useUserSoftware'
import {useAdvicedDimensions} from '~/components/layout/FlexibleGridSection'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'

export default function UserSoftware({session}: { session: Session }) {
  const {itemHeight, minWidth, maxWidth} = useAdvicedDimensions('software')
  const {searchFor,page,rows, setCount} = usePaginationWithSearch('Filter software')
  const {loading, software, count} = useUserSoftware({
    searchFor,
    page,
    rows,
    session
  })

  // console.group('UserSoftware')
  // console.log('loading...', loading)
  // console.log('software...', software)
  // console.log('searchFor...', searchFor)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.groupEnd()

  useEffect(() => {
    if (count && loading === false) {
      setCount(count)
    }
  }, [count, loading, setCount])

  // if loading show loader
  if (loading) return (
    <ContentLoader />
  )

  return (
    <SoftwareGrid
      software={software}
      grid={{
        height:itemHeight,
        minWidth,
        maxWidth
      }}
      className="gap-[0.125rem] pt-4 pb-12"
    />
  )

}
