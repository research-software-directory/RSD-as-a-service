// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import useMediaQuery from '@mui/material/useMediaQuery'

import {RelatedProject} from '../../types/Project'
import PageContainer from '../layout/PageContainer'
import ProjectsGrid from '../user/project/ProjectsGrid'

export default function RelatedProjectsSection({relatedProjects}:
  { relatedProjects: RelatedProject[] }) {
  // use media query hook for small screen logic
  const smallScreen = useMediaQuery('(max-width:600px)')
  // adjust grid min width for mobile
  const minWidth = smallScreen ? '18rem' : '26rem'
  // do not show section if no data
  if (typeof relatedProjects == 'undefined' || relatedProjects.length === 0) return null

  return (
    <PageContainer className="py-12 px-4 lg:grid lg:grid-cols-[1fr,4fr]">
      <h2
        data-testid="software-contributors-section-title"
        className="pb-8 text-[2rem] text-primary">
        Related projects
      </h2>
      <ProjectsGrid
        className='gap-[0.125rem]'
        minWidth={minWidth}
        maxWidth='1fr'
        height='17rem'
        projects={relatedProjects}
      />
    </PageContainer>
  )
}
