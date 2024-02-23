// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {findMention} from '~/components/mention/config'
import config from '~/components/mention/ImportMentions/config'

export const cfgMention = {
  title: 'Mentions',
  findMention: {
    ...findMention,
    title: 'Add related output'
  },
  doiInput: config.doiInput,
  builkImport: {
    title: 'Import',
  },
  newItem: {
    title: 'Create',
  }
}
