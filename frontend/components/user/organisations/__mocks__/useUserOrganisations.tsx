// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import organisationsByMaintainer from './organisationsByMaintainer.json'

export default function useUserOrganisations() {

  return {
    organisations: organisationsByMaintainer,
    loading: false
  }
}
