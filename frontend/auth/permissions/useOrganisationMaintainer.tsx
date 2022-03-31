import {useEffect,useState} from 'react'
import {Session} from '..'
import isMaintainerOfOrganisation from './isMaintainerOfOrganisation'

type UseOrganisationMaintainerProps = {
  organisation: string
  session: Session
}

export default function useOrganisationMaintainer({organisation,session}:UseOrganisationMaintainerProps) {
  const [isMaintainer, setIsMaintainer] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function organisationMaintainer() {
      setLoading(true)
      const isMaintainer = await isMaintainerOfOrganisation({
        organisation,
        account: session.user?.account ?? '',
        token: session.token,
        frontend: true
      })
      if (abort) return
      setIsMaintainer(isMaintainer)
      setLoading(false)
    }
    if (organisation &&
      session &&
      session.status === 'authenticated') {
      organisationMaintainer()
    } else if (isMaintainer===true) {
      // set to false if flag is true without
      setIsMaintainer(false)
    } else if (session && session?.status!=='loading'){
      setLoading(false)
    }
    return ()=>{abort=true}
  },[organisation,session, isMaintainer])

  return {
    loading,
    isMaintainer
  }
}
