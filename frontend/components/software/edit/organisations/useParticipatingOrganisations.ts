// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {EditOrganisation} from '~/types/Organisation'
import {
  getParticipatingOrganisationsForSoftware,
  UseParticipatingOrganisationsProps
} from './apiSoftwareOrganisations'

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
