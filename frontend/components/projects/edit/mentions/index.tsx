// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {ProjectMentionProvider} from './ProjectMentionContext'
import ProjectMentionTabs from './ProjectMentionTabs'

export default function ProjectMentions() {

  return (
    <section
      aria-label="Project output, citations and impact"
      className="flex-1">
      <ProjectMentionProvider>
        <ProjectMentionTabs />
      </ProjectMentionProvider>
    </section>
  )
}
