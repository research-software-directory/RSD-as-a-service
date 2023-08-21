// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockOrganisations from '../../../../__tests__/__mocks__/organisationsOverview.json'

// DEAFULT MOCK
export default function useOrganisations(token: string) {
  // console.log('useOrganisations...default MOCK')
  return {
    loading:false,
    organisations:mockOrganisations
  }
}
