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
        const organisation: EditOrganisation = getPropsFromObject(item.organisation, columsForUpdate)
        // additional props for edit
        organisation.position = pos + 1
        organisation.logo_b64 = null
        organisation.logo_mime_type = null
        organisation.source = 'RSD' as 'RSD'
        organisation.status = item.status
        organisation.canEdit = item.organisation.primary_maintainer === account
        // organisation logo
        if (item.organisation?.logo_for_organisation &&
          item.organisation?.logo_for_organisation?.length > 0) {
          organisation.logo_id = item.organisation?.logo_for_organisation[0]?.id ?? null
        } else {
          organisation.logo_id = null
        }
        return organisation
      }).sort((a, b) => sortOnStrProp(a, b, 'name'))
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
