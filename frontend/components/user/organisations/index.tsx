// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {Session} from '~/auth'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import ContentLoader from '~/components/layout/ContentLoader'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

export default function UserOrganisations({session}: { session: Session }) {
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for organisation')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort=false
    setTimeout(() => {
      if (abort) return
      setLoading(false)
    }, 1000)
    return()=>{abort=true}
  },[])


  if (loading) return <ContentLoader />

  // console.group('UserOrganisations')
  // console.log('searchFor...', searchFor)
  // console.log('page...', page)
  // console.log('rows...', rows)
  // console.log('session...', session)
  // console.groupEnd()

  return (
    <div className="flex-1 flex flex-col">
      <h1>User organisation</h1>
      <ContentInTheMiddle>
        <h2>Under construction</h2>
      </ContentInTheMiddle>
    </div>
  )
}
