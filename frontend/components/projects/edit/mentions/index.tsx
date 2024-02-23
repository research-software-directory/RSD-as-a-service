// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectMentionProvider} from './ProjectMentionContext'
import ProjectMentionTabs from './ProjectMentionTabs'

export default function ProjectMentionsPage() {

  return (
    <article className="flex-1">
      <ProjectMentionProvider>
        <ProjectMentionTabs />
      </ProjectMentionProvider>
    </article>
  )
}
