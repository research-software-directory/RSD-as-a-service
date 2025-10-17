// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import mockOrganisations from '~/utils/jest/__mocks__/organisationsOverview.json'

// DEAFULT MOCK
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const useOrganisations=jest.fn((token: string)=>{
  // console.log('useOrganisations...default MOCK')
  return {
    loading: false,
    organisations: mockOrganisations
  }
})

export default useOrganisations
