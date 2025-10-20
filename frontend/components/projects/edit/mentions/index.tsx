// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {ProjectMentionProvider} from './ProjectMentionContext'
import ProjectMentionTabs from './ProjectMentionTabs'

export default function ProjectMentions() {

  return (
    <section className="flex-1">
      <ProjectMentionProvider>
        <ProjectMentionTabs />
      </ProjectMentionProvider>
    </section>
  )
}
