// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState,useEffect} from 'react'
import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'

export default function UserProfile({session}: { session: Session }) {
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

  return (
    <div>
      <h1>User profile</h1>
      <pre className="w-[60rem]">
        {JSON.stringify(session,null,2)}
      </pre>
    </div>
  )
}
