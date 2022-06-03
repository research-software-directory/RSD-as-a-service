// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'

import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import GridScrim from '~/components/layout/GridScrim'
import SoftwareGrid from '~/components/software/SoftwareGrid'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import useUserSoftware from './useUserSoftware'

export default function UserSoftware({session}:{session:Session}) {
  const {searchFor,page,rows, setCount} = usePaginationWithSearch('Search for software')
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
  },[count,loading,setCount])

  // do not use loader for now
  // because the layout jumps up-and-down
  // on pagination
  // if (loading) {
  //   return (
  //     <ContentLoader />
  //   )
  //   // return (
  //   //   <GridScrim
  //   //     rows={rows}
  //   //     height='17rem'
  //   //     minWidth='25rem'
  //   //     maxWidth='1fr'
  //   //     className="gap-[0.125rem] pt-2 pb-12"
  //   //   />
  //   // )
  // }

  // console.group('UserSoftware')
  // console.log('searchFor...', searchFor)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <SoftwareGrid
      software={software}
      grid={{
        height:'17rem',
        minWidth:'25rem',
        maxWidth:'1fr'
      }}
      className="gap-[0.125rem] pt-2 pb-12"
    />
  )

}
