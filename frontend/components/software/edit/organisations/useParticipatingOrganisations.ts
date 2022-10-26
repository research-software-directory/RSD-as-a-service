// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import isMaintainerOfOrganisation from '~/auth/permissions/isMaintainerOfOrganisation'
import {EditOrganisation} from '../../../../types/Organisation'
import {getOrganisationsForSoftware} from '../../../../utils/editOrganisation'

type UseParticipatingOrganisationsProps = {
  software: string,
  token: string,
  account: string
}

async function getParticipatingOrganisationsForSoftware({software, token, account}: UseParticipatingOrganisationsProps) {
  const resp = await getOrganisationsForSoftware({
    software,
    token
  })
  // collect isMaintainerRequests
  const promises: Promise<boolean>[] = []
  // prepare organisation list
  const orgList = resp.map((item, pos) => {
    // save isMaintainer request
    promises.push(isMaintainerOfOrganisation({
      organisation: item.id,
      account,
      token,
      frontend: true
    }))
    // extract only needed props
    const organisation: EditOrganisation = {
      ...item,
      // additional props for edit type
      position: pos + 1,
      logo_b64: null,
      logo_mime_type: null,
      source: 'RSD' as 'RSD',
      status: item.status,
      // false by default
      canEdit: false,
      description: null
    }
    return organisation
  })
  // run all isMaintainer requests in parallel
  const isMaintainer = await Promise.all(promises)
  const organisations = orgList.map((item, pos) => {
    // update canEdit based on isMaintainer requests
    if (isMaintainer[pos]) item.canEdit = isMaintainer[pos]
    return item
  })
  return organisations
}


export function useParticipatingOrganisations({software, token, account}: UseParticipatingOrganisationsProps) {
  const [organisations, setOrganisations] = useState<EditOrganisation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedSoftware, setLoadedSoftware] = useState<string>('')

  useEffect(() => {
    let abort = false
    async function getOrganisations(props: UseParticipatingOrganisationsProps) {
      const organisations = await getParticipatingOrganisationsForSoftware(props)
      if (abort === true) return
      // update organisation list
      setOrganisations(organisations)
      setLoadedSoftware(props.software)
      // upadate loading state
      setLoading(false)
    }
    if (software && token && account &&
      software !== loadedSoftware) {
      getOrganisations({
        software,
        token,
        account
      })
    }
    return () => { abort = true }
  }, [software, token, account, loadedSoftware])

  return {
    loading,
    organisations,
    setOrganisations
  }
}

export default useParticipatingOrganisations
