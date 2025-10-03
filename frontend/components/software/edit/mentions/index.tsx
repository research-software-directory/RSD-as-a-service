// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {SoftwareMentionProvider} from './SoftwareMentionContext'
import SoftwareMentionTabs from './SoftwareMentionTabs'

export default function EditSoftwareMentionsPage() {

  return (
    <SoftwareMentionProvider>
      <SoftwareMentionTabs />
    </SoftwareMentionProvider>
  )
}
