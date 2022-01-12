import {useAuth} from '../../auth'
import ContentInTheMiddle from './ContentInTheMiddle'

export default function ProtectedContent({children}:{children:any}) {
  const {session} = useAuth()
  const status = session?.status ?? 'loading'

  // return nothing
  if (status==='loading') return null

  // authenticated
  if (status==='authenticated'){
    return children
  }

  // not authenticated
  return (
    <ContentInTheMiddle>
      <h1 className="text-error">401 UNAUTHORIZED</h1>
    </ContentInTheMiddle>
  )
}
