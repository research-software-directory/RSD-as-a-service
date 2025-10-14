// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import organisationsByMaintainer from './organisationsByMaintainer.json'

const useUserOrganisations=jest.fn(()=>{
  return {
    organisations: organisationsByMaintainer,
    loading: false
  }
})

export default useUserOrganisations
