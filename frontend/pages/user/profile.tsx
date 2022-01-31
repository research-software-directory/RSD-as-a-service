import {useAuth} from '../../auth'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProtectedContent from '../../auth/ProtectedContent'

export default function UserProfilePage() {
  const {session} = useAuth()

  return (
    <DefaultLayout>
      <ProtectedContent>
        <h1>Profile page</h1>
        <h2>User status: {session?.status}</h2>
        <h2>Profile info</h2>
        <pre>
          {JSON.stringify(session,null,2)}
        </pre>
      </ProtectedContent>
    </DefaultLayout>
  )
}
