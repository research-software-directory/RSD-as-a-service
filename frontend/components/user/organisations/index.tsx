import {useState,useEffect} from 'react'
import {Session} from '~/auth'
import ContentInTheMiddle from '~/components/layout/ContentInTheMiddle'
import ContentLoader from '~/components/layout/ContentLoader'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'

export default function UserOrganisations({session}: { session: Session }) {
  const {searchFor,page,rows,setCount} = usePaginationWithSearch('Search for organisation')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },1000)
  },[])

  if (loading) return <ContentLoader />

  console.group('UserOrganisations')
  console.log('searchFor...', searchFor)
  console.log('page...', page)
  console.log('rows...', rows)
  console.log('session...', session)
  console.groupEnd()

  return (
    <div className="flex-1 flex flex-col">
      <h1>User organisarion</h1>
      <ContentInTheMiddle>
        <h2>Under construction</h2>
      </ContentInTheMiddle>
    </div>
  )
}
