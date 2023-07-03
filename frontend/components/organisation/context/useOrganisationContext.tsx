// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'

import OrganisationContext from './OrganisationContext'

export default function useOrganisationContext() {
  const {organisation, isMaintainer, updateOrganisation} = useContext(OrganisationContext)
  // console.group('useOrganisationContext')
  // console.log('organisation...', organisation)
  // console.log('isMaintainer....', isMaintainer)
  // console.log('loading....', loading)
  // console.groupEnd()

  return {
    ...organisation,
    isMaintainer,
    updateOrganisation
  }
}
