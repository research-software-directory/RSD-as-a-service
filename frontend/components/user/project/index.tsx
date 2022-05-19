import {useEffect, useState} from 'react'

import ContentLoader from '~/components/layout/ContentLoader'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

export default function UserProjects() {
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for project')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },1000)
  },[])

  if (loading) return <ContentLoader />
  return (
    <div>
      <h1>User projects</h1>
    </div>
  )
}
