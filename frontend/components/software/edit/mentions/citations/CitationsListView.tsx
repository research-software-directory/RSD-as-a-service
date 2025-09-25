// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import Button from '@mui/material/Button'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import AccordionForLightTheme from '~/components/mention/AccordionForLightTheme'
import MentionViewItem from '~/components/mention/MentionViewItem'
import useListPagination from '~/components/mention/useListPagination'
import {MentionItemProps} from '~/types/Mention'

type ViewCitationsList = {
  title: string
  items: MentionItemProps[]
}

export default function CitationsListView({title,items}:ViewCitationsList) {
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
        {selection.map((item, pos) => {
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
