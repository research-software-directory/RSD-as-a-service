import {useState,useEffect} from 'react'
import {Session} from '~/auth'
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
    <div>
      <h1>User organisations</h1>
      {/* <pre className="w-[60rem]">
        {JSON.stringify(session,null,2)}
      </pre> */}
    </div>
  )
}
