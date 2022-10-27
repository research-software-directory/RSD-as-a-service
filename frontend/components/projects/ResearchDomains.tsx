// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from '@mui/material/Link'
import LinkIcon from '@mui/icons-material/Link'
import TagChip from '~/components/layout/TagChip'
import {ResearchDomain} from '~/types/Project'

export default function ResearchDomains({domains}:{domains:ResearchDomain[]}) {

  function renderTags() {
    if (domains.length === 0) {
      return <i>Not specified</i>
    }
    return (
      <div className="flex flex-wrap gap-2 py-1">
        {
          domains.map((item, pos) => {
            return (
              <TagChip
                key={pos}
                label={`${item.key}: ${item.name}`}
                title={item.description}
              />
            )
          })
        }
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-primary py-4">
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
      </h4>
      {renderTags()}
    </div>
  )
}
