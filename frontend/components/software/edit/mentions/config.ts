// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {findMention} from '~/components/mention/config'
import {cfgImpact} from '~/components/projects/edit/impact/config'

export const cfgMention = {
  title: 'Mentions',
  findMention: {
    ...findMention,
    title: 'Add mention'
  },
  builkImport: {
    title: 'Import publications',
    subtitle: cfgImpact.builkImport.subtitle
  },
  newItem: {
    title: 'New mention without DOI',
    subtitle: 'Use add button to create new item without DOI'
  }
}
