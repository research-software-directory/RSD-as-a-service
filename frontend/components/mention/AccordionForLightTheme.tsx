// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Badge from '@mui/material/Badge'

import {AccordionProps} from './AccordionForDarkTheme'

export default function AccordionForLightTheme({
  title,badgeContent,maxBadgeCount=9999,children
}: AccordionProps) {

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
          badgeContent={badgeContent}
          max={maxBadgeCount}
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
      <AccordionDetails sx={{
        // set max height to avoid large shifts
        maxHeight: '32rem',
        //avoid resizing when scrollbar appears
        overflow: 'overlay',
        padding: '0rem 0rem'
      }}>
        {children}
      </AccordionDetails>
    </Accordion>
  )
}
