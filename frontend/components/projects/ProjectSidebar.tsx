// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {KeywordForProject, ProjectLink, ResearchDomain} from '~/types/Project'
import {ProjectOrganisationProps} from '~/types/Organisation'
import {CategoryPath} from '~/types/Category'
import SidebarPanel from '~/components/layout/SidebarPanel'
import ProjectStatus from './ProjectStatus'
import {FundedBy, FundedUnder} from './ProjectFunding'
import ProjectLinks from './ProjectLinks'
import ProjectKeywords from './ProjectKeywords'
import ResearchDomains from './ResearchDomains'
import ProjectCategories from './ProjectCategories'

type ProjectSidebarProps = {
  date_start: string | null
  date_end: string | null
  grant_id: string | null
  researchDomains: ResearchDomain[],
  keywords: KeywordForProject[],
  links: ProjectLink[],
  fundingOrganisations: ProjectOrganisationProps[],
  categories: CategoryPath[]
}

export default function ProjectSidebar({date_start, date_end, grant_id, links, researchDomains,
  keywords, categories, fundingOrganisations}: ProjectSidebarProps) {

  return (
    <SidebarPanel className="bg-base-200 p-6 mb-4">

      <ProjectStatus
        date_start={date_start}
        date_end={date_end}
      />

      <FundedUnder
        grant_id={grant_id}
      />

      <FundedBy
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

      <ProjectCategories
        categories={categories}
      />

    </SidebarPanel>
  )
}
