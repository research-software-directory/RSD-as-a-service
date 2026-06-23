// SPDX-FileCopyrightText: 2023 - 2024 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {MuiIconName} from '~/components/category/CategoryIcon'
import {CommunityRequestStatus} from '~/components/communities/software/apiCommunitySoftware'
import {OrganisationStatus} from './Organisation'

export type CategoryProperties = {
  icon?: MuiIconName
  is_highlight?: boolean
  subtitle?: string
  description?: string
  tree_level_labels?: string[]
  // add items count for category filter
  count?: number
}

export type CategoryEntry = {
  id: string
  parent: string | null
  community: string | null
  organisation: string | null
  allow_software: boolean
  allow_projects: boolean
  // alias Label for organisation/community items
  short_name: string
  // alias Description for organisation/community items
  name: string
  properties: CategoryProperties
  provenance_iri: string | null
  // values: global, other + organisation and community acceptance statuses
  status: 'global' | 'other' | CommunityRequestStatus | OrganisationStatus
}


export type CategoryPath = CategoryEntry[]
