import {useState,useEffect} from 'react'
import {Session} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'

export default function UserProfile({session}: { session: Session }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    },1000)
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
