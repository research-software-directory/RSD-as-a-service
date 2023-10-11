// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useRef, useState} from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Badge from '@mui/material/Badge'

import {MentionItemProps} from '~/types/Mention'
import MentionEditItem from './MentionEditItem'
import useLazyLoadedItems from './useLazyLoadedItems'
import GetMoreOnScroll from './GetMoreOnScroll'

type MentionSectionListProps = {
  title: string
  items: MentionItemProps[]
}

export default function MentionEditList({title, items}: MentionSectionListProps) {
  const [ofset,setOfset] = useState(0)
  const [limit,setLimit] = useState(20)
  const {mentions,hasMore} = useLazyLoadedItems({items,ofset,limit})
  const parentRef = useRef(null)
  // do not render accordion/section if no items
  if (!mentions || mentions.length===0) return null

  // console.group('MentionEditList')
  // console.log('mentions...', mentions)
  // console.log('items...', items)
  // console.log('ofeset...', ofset)
  // console.log('limit...', limit)
  // console.log('hasMore...', hasMore)
  // console.groupEnd()

  // debugger
  return (
    <Accordion
      data-testid='mentions-section-for-type'
      sx={{
        boxShadow: 0,
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        // remove line above the accordion
        '&:before': {
          height: '0px'
        },
        '&:last-child': {
          borderBottom: '1px solid',
          borderColor: 'divider'
        }
      }}>
      <AccordionSummary
        expandIcon={
          <ExpandMoreIcon />
        }
        sx={{
          position: 'sticky',
          top: 0,
          // FF fix for list items mixing with section title
          // when scrolling through long list
          backgroundColor: 'background.paper',
          padding: '0rem',
          '&:hover': {
            opacity:0.95
          }
        }}
      >
        <Badge
          badgeContent={items.length ?? null}
          max={99999}
          color="primary"
          sx={{
            '& .MuiBadge-badge': {
              right: '-1rem',
              top: '0.25rem',
              border: '1px solid',
              borderColor: 'primary.contrastText',
              color: 'primary.contrastText',
              fontWeight: 500
            },
          }}
        >
          <div className="text-xl">{title}</div>
        </Badge>
      </AccordionSummary>
      <AccordionDetails
        ref={parentRef}
        sx={{
          // set max height to avoid large shifts
          maxHeight: '32rem',
          //avoid resizing when scrollbar appears
          overflow: 'overlay',
          padding: '0rem 0rem'
        }}>
        <ul>
          {
            mentions.map((item, pos) => {
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
          <GetMoreOnScroll
            options={{
              root: parentRef.current,
              threshold: 0.75
            }}
            show={hasMore}
            onLoad={()=>setOfset(mentions.length)}
          />
        </ul>
      </AccordionDetails>
    </Accordion>
  )
}
