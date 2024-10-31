// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {TabKey, organisationTabItems} from './OrganisationTabItems'

export default function useSelectedTab(tab_id: TabKey|null): TabKey {
  // default tab is software
  let selected:TabKey = 'software'

  // if tab provided use it
  if (tab_id !== null && organisationTabItems.hasOwnProperty(tab_id)) {
    selected = tab_id
  }

  return selected
}
