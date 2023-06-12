// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ProjectOrganisationProps} from '~/types/Organisation'
import {KeywordForProject, ProjectLink, ResearchDomain} from '../../types/Project'
import ProjectDescription from './ProjectDescription'
import ProjectSidebar from './ProjectSidebar'

type ProjectInfoProps = {
  date_start: string | null,
  date_end: string | null,
  description: string | null,
  image_id: string | null,
  image_caption: string | null,
  image_contain: boolean,
  grant_id: string | null,
  links: ProjectLink[],
  researchDomains: ResearchDomain[],
  keywords: KeywordForProject[],
  fundingOrganisations: ProjectOrganisationProps[],
}


export default function ProjectInfo(
  {image_id, image_caption, image_contain, description, date_start, date_end,
  grant_id, links, researchDomains, keywords, fundingOrganisations}: ProjectInfoProps
) {
  return (
    <section className="px-4 sm:pb-8 sm:grid sm:gap-8 lg:grid-cols-[3fr,1fr] lg:gap-16">
      <ProjectDescription
        image_id={image_id}
        image_caption={image_caption ?? ''}
        image_contain={image_contain}
        description={description ?? ''}
      />
      <ProjectSidebar
        date_start={date_start}
        date_end={date_end}
        grant_id={grant_id}
        researchDomains={researchDomains}
        keywords={keywords}
        links={links}
        fundingOrganisations={fundingOrganisations}
      />
    </section>
  )
}
