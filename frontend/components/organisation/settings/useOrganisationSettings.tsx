// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {OrganisationForOverview} from '~/types/Organisation'
import {getOrganisationById} from '~/utils/getOrganisations'

type UseOrganisationSettingsProps = {
  uuid: string,
  token: string
}

export default function useOrganisationSettings({uuid, token}:UseOrganisationSettingsProps) {
  const [loading, setLoading] = useState(true)
  const [settings, setOrganisation] = useState<OrganisationForOverview>()

  useEffect(() => {
    let abort = false
    async function getOrganisationSettings() {
      setLoading(true)
      const organisation = await getOrganisationById({
        uuid,
        token,
        frontend:true
      })
      if (abort) return
      setOrganisation(organisation)
      setLoading(false)
    }
    if (uuid && token) {
      getOrganisationSettings()
    }
    return ()=>{abort=true}
  },[uuid,token])

  return {
    loading,
    settings
  }
}

