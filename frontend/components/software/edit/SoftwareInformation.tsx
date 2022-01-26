import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'

import CircularProgress from '@mui/material/CircularProgress'

import {useAuth} from '../../../auth'
import {SoftwareTableItem} from '../../../types/SoftwareItem'
import {editSoftware} from '../../../utils/editSoftware'
import EditSoftwareSection from './EditSoftwareSection'
import SoftwareDescription from './SoftwareDescription'

export default function SoftwareInformation() {
  const {session} = useAuth()
  const router = useRouter()
  const slug = router.query['slug']?.toString()
  const [loading, setLoading] = useState(false)
  const [software, setSoftware] = useState<SoftwareTableItem>()
  const {token} = session

  useEffect(() => {
    if (slug && token) {
      setLoading(true)
      editSoftware({slug, token})
        .then(data => {
          // debugger
          setSoftware(data)
          setLoading(false)
        })
    }
  },[slug, token])

  return (
    <EditSoftwareSection className='xl:grid xl:grid-cols-[3fr,1fr] xl:px-0'>
      <div className="xl:px-8">
        <h2>Middle pannel</h2>
        {loading ?
          <CircularProgress />
          :
          <pre>
            {JSON.stringify(software, null, 2)}
          </pre>
        }
      </div>
      <div className="my-8 xl:my-0">
        <h2>Right pannel</h2>
      </div>
    </EditSoftwareSection>
  )
}
