// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {findMention} from '~/components/mention/config'

export const cfgImpact = {
  title: 'Impact',
  findMention: {
    ...findMention,
    title: 'Add impact',
    // subtitle: 'We search in Crossref, DataCite and RSD databases',
    // label: 'Search by DOI or publication title',
    // help: 'Provide a valid DOI or the title of the publication',
  },
  builkImport: {
    title: 'Import publications',
    subtitle: 'Import multiple publications at once using a DOI list'
  },
  newItem: {
    title: 'New item without DOI',
    subtitle: 'Use add button to create new item without DOI'
  }
}
