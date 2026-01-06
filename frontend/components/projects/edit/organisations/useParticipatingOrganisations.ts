// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {canEditOrganisations} from '~/auth/permissions/isMaintainerOfOrganisation'
import {EditOrganisation} from '~/types/Organisation'
import {getOrganisationsOfProject} from '~/components/projects/apiProjects'

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
    {project: string, token: string, account: string}) {
      const resp = await getOrganisationsOfProject({
        project,
        token,
        roles:['participating','hosting']
      })
      // convert to EditOrganisation type and add canEdit flag
      const organisations = await canEditOrganisations({
        organisations: resp,
        account,
        token
      })
      if (abort === true) return
      // update organisation list
      setOrganisations(organisations)
      // keep track of loaded info
      setLoadedProject({
        id: project,
        account
      })
      // update loading state
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
