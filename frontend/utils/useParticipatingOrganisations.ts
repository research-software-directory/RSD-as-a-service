import {useEffect, useState} from 'react'
import {EditOrganisation} from '../types/Organisation'
import {columsForUpdate, getOrganisationsForSoftware} from './editOrganisation'
import {getPropsFromObject} from './getPropsFromObject'
import {sortOnStrProp} from './sortFn'

type UseParticipatingOrganisationsProps = {
  software: string | undefined,
  token: string | undefined,
  account: string | undefined
}

export function useParticipatingOrganisations({software, token, account}: UseParticipatingOrganisationsProps) {
  const [organisations, setOrganisations] = useState<EditOrganisation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let abort = false
    async function getOrganisations({software, token, account}:
      { software: string, token: string, account: string}) {
      const resp = await getOrganisationsForSoftware({
        software,
        token
      })
      if (abort === true) return
      // prepare organisation list
      // and sort! items on name
      const orgList = resp.map((item, pos) => {
        // extract only needed props
        const organisation: EditOrganisation = {
          ...item,
          // additional props for edit type
          position:pos + 1,
          logo_b64:null,
          logo_mime_type:null,
          source:'RSD' as 'RSD',
          status:item.status,
          canEdit:item.primary_maintainer === account
        }
        return organisation
      })
      // update organisation list
      setOrganisations(orgList)
      // upadate loading state
      setLoading(false)
    }
    if (software && token && account) {
      getOrganisations({
        software,
        token,
        account
      })
    }
    () => { abort = true }
  }, [software, token, account])

  return {
    loading,
    organisations,
    setOrganisations
  }
}

export default useParticipatingOrganisations
