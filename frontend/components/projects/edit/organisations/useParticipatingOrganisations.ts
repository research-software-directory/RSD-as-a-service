// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import isMaintainerOfOrganisation from '~/auth/permissions/isMaintainerOfOrganisation'
import {EditOrganisation} from '~/types/Organisation'
import {getOrganisationsOfProject} from '~/utils/getProjects'

type UseParticipatingOrganisationsProps = {
  project: string | undefined,
  token: string | undefined,
  account: string | undefined
}

export function useParticipatingOrganisations({project, token, account}: UseParticipatingOrganisationsProps) {
  const [organisations, setOrganisations] = useState<EditOrganisation[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedProject, setLoadedProject] = useState({
    id:'',
    account:'',
  })
  useEffect(() => {
    let abort = false
    async function getOrganisations({project, token, account}:
      { project: string, token: string, account: string }) {
      const resp = await getOrganisationsOfProject({
        project,
        token,
        frontend: true,
        roles:['participating','hosting']
      })
      // collect isMaintainerRequests
      const promises:Promise<boolean>[] = []
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
      if (abort === true) return
      // update organisation list
      setOrganisations(organisations)
      // keep track of loaded info
      setLoadedProject({
        id: project,
        account
      })
      // upadate loading state
      setLoading(false)
    }
    if (project && token && account &&
      loadedProject.id !== project &&
      loadedProject.account !== account) {
      getOrganisations({
        project,
        token,
        account
      })
    }
    return () => { abort = true }
  }, [project, token, account, loadedProject])

  return {
    loading,
    organisations,
    setOrganisations
  }
}

export default useParticipatingOrganisations
