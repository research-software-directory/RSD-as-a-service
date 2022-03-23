import {useRouter} from 'next/router'
import {useAuth} from '../../auth'
import DefaultLayout from '../../components/layout/DefaultLayout'
import ProtectedContent from '../../auth/ProtectedContent'
import PageTitle from '../../components/layout/PageTitle'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function UserProfilePage() {
  const {session} = useAuth()
  const router = useRouter()

  return (
    <DefaultLayout>
      <ProtectedContent>
        <PageTitle title="UNDER CONSTRUCTION: user profile page">
        <div>
          <IconButton
            title="Go back"
            onClick={()=>router.back()}>
            <ArrowBackIcon />
          </IconButton>
          {/* <IconButton
            title="Edit"
            onClick={()=>router.push(`/projects/${slug}/edit`)}
            disabled={status!=='authenticated'}
          >
            <EditIcon />
          </IconButton> */}
        </div>
      </PageTitle>
      <h2 className='my-4'>
        User status: {session?.status}
      </h2>
      <pre>
        {JSON.stringify(session,null,2)}
      </pre>
      </ProtectedContent>
    </DefaultLayout>
  )
}
