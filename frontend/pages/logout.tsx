import {useEffect} from 'react'
import ContentInTheMiddle from '../components/layout/ContentInTheMiddle'
import {getRsdTokenNode, removeRsdTokenNode} from '../auth'
import Button from '@mui/material/Button'
import {useAuth, defaultSession, Session} from '../auth'

export default function Logout({session}:{session:Session}) {
  const {setSession} = useAuth()
  useEffect(() => {
    setSession(session)
  },[session,setSession])
  return (
    <ContentInTheMiddle>
      <div className="border p-12">
        <h1>You are logged out!</h1>
        <p className="py-8">
          You can go now doing something else :-)
         </p>
         <Button onClick={() => window.location.href = '/'}>
           Home
         </Button>
      </div>
    </ContentInTheMiddle>
  )
}

export function getServerSideProps(context: any) {
  const {req, res} = context
  // get token
  const token = getRsdTokenNode(req)
  // console.group('Logout')
  // console.log('session...', session)
  // remove old cookie
  if (token) {
    // console.log('removeRsdTokenNode...')
    removeRsdTokenNode(res)
  }
  // console.groupEnd()
  return {
    props: {
      // return default
      session: defaultSession
    }
  }
}
