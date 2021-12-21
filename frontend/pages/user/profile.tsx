import {useSession} from 'next-auth/react'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProtectedContent from '../../components/layout/ProtectedContent'

export default function UserProfilePage() {
  const {data, status} = useSession()
  return (
    <DefaultLayout>
      <ProtectedContent>
        <h1>Profile page</h1>
        <h2>User status: {status}</h2>
        <h2>Profile info</h2>
        <pre>
          {JSON.stringify(data,null,2)}
        </pre>
      </ProtectedContent>
    </DefaultLayout>
  )
}
