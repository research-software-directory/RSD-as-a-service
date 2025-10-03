// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {MentionItemProps} from '~/types/Mention'
import MentionViewItem from './MentionViewItem'
import useListPagination from './useListPagination'
import Button from '@mui/material/Button'
import AccordionForDarkTheme from './AccordionForDarkTheme'

type MentionSectionListProps = {
  title: string
  items: MentionItemProps[]
}

export default function MentionViewList({title, items}: MentionSectionListProps) {
  // show top 50 items, use hasMore to show button to load all items
  const [limit,setLimit] = useState(50)
  const {selection,hasMore} = useListPagination({items,limit})
  // do not render accordion/section if no items
  if (!items || items.length===0) return null

  // console.group('MentionViewList')
  // console.log('items...', items)
  // console.log('selection...', selection)
  // console.log('hasMore...', hasMore)
  // console.groupEnd()

  // debugger
  return (
    <AccordionForDarkTheme
      title={title}
      badgeContent={items?.length ?? 0}
    >
      <ul>
        {selection.map((item, pos) => {
          return (
            <li key={pos} className="p-4">
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
    </AccordionForDarkTheme>
  )
}
