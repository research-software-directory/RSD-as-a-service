// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createContext,useCallback,useEffect,useState} from 'react'
import {OrganisationForOverview} from '~/types/Organisation'

type UpdateOrganisationProps = {
  key: keyof OrganisationForOverview,
  value: any
}

type OrganisationContextProps = {
  organisation: OrganisationForOverview | null
  isMaintainer: boolean
  updateOrganisation:({key,value}:UpdateOrganisationProps)=>void
}

const OrganisationContext = createContext<OrganisationContextProps>({
  organisation: null,
  isMaintainer: false,
  updateOrganisation: ({key, value}: UpdateOrganisationProps) => { }
})

export function OrganisationProvider(props: any) {
  // destucture organisation
  const {organisation:initOrganisation, isMaintainer:initMaintainer} = props
  // set state - use initOrganisation at start
  const [organisation, setOrganisation] = useState<OrganisationForOverview | null>(initOrganisation)
  const [isMaintainer, setIsMaintainer] = useState<boolean>(initMaintainer ?? false)

  const updateOrganisation = useCallback(({key, value}:UpdateOrganisationProps) => {
    if (organisation) {
      const org = {
        ...organisation,
        [key]:value
      }
      setOrganisation(org)
    }
  },[organisation])

  // we need to update organisation state every time initOrganistation changes
  // because useState is running in different context
  useEffect(() => {
    if (initOrganisation.id && !organisation) {
      setOrganisation(initOrganisation)
    }
    if (initOrganisation.id && organisation && (
      initOrganisation.id !== organisation.id
    )) {
      setOrganisation(initOrganisation)
    }
    if (organisation && !initOrganisation) {
      setOrganisation(null)
    }
  }, [initOrganisation, organisation])

  useEffect(() => {
    if (initMaintainer!==isMaintainer) setIsMaintainer(initMaintainer)
  },[isMaintainer, initMaintainer])

  // return context
  return <OrganisationContext.Provider
    value={{
      organisation,
      isMaintainer,
      updateOrganisation
    }}
    {...props}
  />
}

export default OrganisationContext
