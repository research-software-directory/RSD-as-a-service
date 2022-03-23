import {useRouter} from 'next/router'

import DefaultLayout from '../../components/layout/DefaultLayout'
import ProtectedContent from '../../auth/ProtectedContent'

import PageTitle from '../../components/layout/PageTitle'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'


export default function UserSoftwarePage() {
  const router = useRouter()
  return (
    <DefaultLayout>
      <ProtectedContent>
        <PageTitle title="UNDER CONSTRUCTION: user software page">
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
        User software page
      </h2>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis quo corporis nostrum eum beatae aperiam hic dolorem ipsum laborum mollitia.
      </p>
      </ProtectedContent>
    </DefaultLayout>
  )
}
