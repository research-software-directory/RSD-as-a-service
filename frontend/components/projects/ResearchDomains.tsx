// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import Link from '@mui/material/Link'
import LinkIcon from '@mui/icons-material/Link'
import {ResearchDomain} from '~/types/Project'
import {ssrProjectsUrl} from '~/utils/postgrestUrl'
import TagChipFilter from '~/components/layout/TagChipFilter'
import ProjectSidebarSection from '~/components/layout/SidebarSection'
import ProjectSidebarTitle from '~/components/layout/SidebarTitle'

export default function ResearchDomains({domains}:{domains:ResearchDomain[]}) {

  function renderTags() {
    if (domains.length === 0) {
      return <i>Not specified</i>
    }
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {
          domains.map((item, pos) => {
            const url = ssrProjectsUrl({domains: [item.key]})
            const label = `${item.key}: ${item.name}`
            return <TagChipFilter url={url} key={pos} label={label} />
          })
        }
      </div>
    )
  }

  return (
    <ProjectSidebarSection>
      <ProjectSidebarTitle>
        Research domains
        <Link
          title="Link to ERC research domains page"
          href="https://erc.europa.eu/news/new-erc-panel-structure-2021-and-2022"
          target="_blank"
          rel="noreferrer">
          <LinkIcon
            fontSize="small"
            sx={{
              marginLeft:'0.5rem'
            }}
          />
        </Link>

      </ProjectSidebarTitle>
      {renderTags()}
    </ProjectSidebarSection>
  )
}
