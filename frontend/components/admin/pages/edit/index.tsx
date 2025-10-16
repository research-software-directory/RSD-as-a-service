// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getUserSettings} from '~/components/user/ssrUserSettings'
import {getPageLinks} from '../useMarkdownPages'
import EditMarkdownPages from './EditMarkdownPages'

export default async function AdminPublicPages() {
  // get links to all pages server side
  const {token} = await getUserSettings()
  const links = await getPageLinks({is_published: false, token})

  return (
    <EditMarkdownPages links={links} />
  )
}
