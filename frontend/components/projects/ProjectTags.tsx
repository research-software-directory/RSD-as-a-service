// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import TagListItem from '../layout/TagListItem'

type TagWithTitle = {
  title: string
  label: string
}

export default function ProjectTags({title,tags}:{title:string, tags: string[] | TagWithTitle[] }) {

  function renderTags() {
    if (tags.length === 0) {
      return <i>Not specified</i>
    }
    return (
      <ul className="flex flex-wrap py-1">
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
              <TagListItem
                key={pos}
                label={label}
                title={title}
                className="bg-grey-400"
              />
            )
          })
        }
      </ul>
    )
  }

  return (
    <div>
      <h4 className="text-primary py-4">{title}</h4>
      {renderTags()}
    </div>
  )
}
