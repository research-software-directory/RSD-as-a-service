import {useEffect, useState} from 'react'

import ContentLoader from '~/components/layout/ContentLoader'

export default function UserSoftware() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },1000)
  },[])

  if (loading) return <ContentLoader />
  return (
    <div>
      <h1>User software</h1>
    </div>
  )
}
