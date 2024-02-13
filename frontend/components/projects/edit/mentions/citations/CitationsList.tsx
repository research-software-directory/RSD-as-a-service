// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {MentionItemProps} from '~/types/Mention'
import MentionViewItem from '~/components/mention/MentionViewItem'
import AccordionForLightTheme from '~/components/mention/AccordionForLightTheme'

type MentionSectionListProps = {
  title: string
  items: MentionItemProps[]
}

export default function CitationsList({title, items}: MentionSectionListProps) {
  // do not render accordion/section if no items
  if (!items || items.length===0) return null

  // debugger
  return (
    <AccordionForLightTheme
      title={title}
      badgeContent={items.length}
    >
      <ul>
        {items.map((item, pos) => {
          return (
            <li key={item.id ?? pos} className="p-4">
              <MentionViewItem
                pos={pos+1}
                item={item}
              />
            </li>
          )
        })
        }
      </ul>
    </AccordionForLightTheme>
  )
}
