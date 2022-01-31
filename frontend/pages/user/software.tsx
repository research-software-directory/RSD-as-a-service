import DefaultLayout from '../../components/layout/DefaultLayout'
import ProtectedContent from '../../auth/ProtectedContent'

export default function UserProfilePage() {
  return (
    <DefaultLayout>
      <ProtectedContent>
        <h1>User software page</h1>
      </ProtectedContent>
    </DefaultLayout>
  )
}
