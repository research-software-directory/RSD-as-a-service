// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Link from '@mui/material/Link'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import TagChip from '~/components/layout/TagChip'

type TagWithTitle = {
  title: string
  label: string
}

export default function ProjectTags({title,tags,infoLink}:{title: string, tags: string[] | TagWithTitle[], infoLink?: string }) {

  function renderTags() {
    if (tags.length === 0) {
      return <i>Not specified</i>
    }
    return (
      <div className="flex flex-wrap py-1">
        {
          tags.map((item, pos) => {
            let label
            let title
            if (typeof item != 'string') {
              label = item?.label
              title= item?.title
            } else {
              label = item
            }
            return (
              <TagChip
                key={pos}
                label={label}
                title={title}
              />
            )
          })
        }
      </div>
    )
  }

  return (
    <div>
      <h4 className="text-primary py-4">{title} {infoLink && <Link href={infoLink} target="_blank" rel="noreferrer"><InfoOutlinedIcon fontSize="small"/></Link>}</h4>
      {renderTags()}
    </div>
  )
}
