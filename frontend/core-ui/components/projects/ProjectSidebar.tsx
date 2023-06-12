// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {KeywordForProject, ProjectLink, ResearchDomain} from '../../types/Project'

import ProjectStatus from './ProjectStatus'
import ProjectFunding from './ProjectFunding'
import ProjectLinks from './ProjectLinks'
import ProjectKeywords from './ProjectKeywords'
import {ProjectOrganisationProps} from '~/types/Organisation'
import ResearchDomains from './ResearchDomains'

type ProjectSidebarProps = {
  date_start: string | null
  date_end: string | null
  grant_id: string | null
  researchDomains: ResearchDomain[],
  keywords: KeywordForProject[],
  links: ProjectLink[]
  fundingOrganisations: ProjectOrganisationProps[]
}

export default function ProjectSidebar({date_start, date_end, grant_id, links, researchDomains,
  keywords, fundingOrganisations}: ProjectSidebarProps) {

  return (
    <aside className="bg-base-200 p-6 mb-4">

      <ProjectStatus
        date_start={date_start}
        date_end={date_end}
      />

      <ProjectFunding
        grant_id={grant_id}
        fundingOrganisations={fundingOrganisations}
      />

      <ProjectLinks
        links={links}
      />

      <ResearchDomains
        domains={researchDomains}
      />

      <ProjectKeywords
        keywords={keywords}
      />

    </aside>
  )
}
