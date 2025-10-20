// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Button from '@mui/material/Button'

import {MentionItemProps} from '~/types/Mention'
import MentionEditItem from './MentionEditItem'
import AccordionForLightTheme from './AccordionForLightTheme'
import useListPagination from './useListPagination'

type MentionSectionListProps = {
  title: string
  items: MentionItemProps[]
}

export default function MentionEditList({title, items}: MentionSectionListProps) {
  // show top 50 items, use hasMore to show button to load all items
  const [limit,setLimit] = useState(50)
  const {selection,hasMore} = useListPagination({items,limit})
  // do not render accordion/section if no items
  if (!items || items.length===0) return null

  return (
    <AccordionForLightTheme
      title={title}
      badgeContent={items.length}
    >
      <ul>
        {
          selection.map((item, pos) => {
            return (
              <li key={item.id ?? pos} className="p-4 hover:bg-base-200 hover:text-base-900">
                <MentionEditItem
                  pos={pos + 1}
                  item={item}
                />
              </li>
            )
          })
        }
        {
          hasMore ?
            <li key="show-all-button" className="p-4">
              <Button
                title='Show more items'
                aria-label="Show more items"
                onClick={()=>setLimit(items.length)}
                size="large"
                startIcon = {<ExpandMoreIcon />}
              >
                Show all
              </Button>
            </li>
            : null
        }
      </ul>
    </AccordionForLightTheme>
  )
}
