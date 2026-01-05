// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import Fab from '@mui/material/Fab'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import FormControlLabel from '@mui/material/FormControlLabel'

import FullScreenTable from './FullScreenTable'
import TableWrapper from './TableWrapper'
import SortableTable from './SortableTable'
import {colLabels, ProjectQualityProps} from './apiProjectQuality'
import Switch from '@mui/material/Switch'

type ProjectQualityTableProps=Readonly<{
  data: ProjectQualityProps[]
  isAdmin: boolean
}>


export default function ProjectQualityTable({data,isAdmin}:ProjectQualityTableProps) {
  const [showAll, setShowAll] = useState(isAdmin)
  const [fullScreen, setFullScreen] = useState(false)

  // console.group('ProjectQualityTable')
  // console.log('fullScreen...', fullScreen)
  // console.groupEnd()

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex justify-end">
        {isAdmin ?
          <FormControlLabel
            label="Show all"
            control={
              <Switch
                className="ml-4"
                checked={showAll}
                onChange={event => setShowAll(event.target.checked)}
              />
            }
          />
          : null
        }
      </div>
      {fullScreen ?
        <FullScreenTable
          onClose={() => setFullScreen(false)}
        >
          <TableWrapper
            sx={{
              minHeight: '90vh',
            }}
          >
            <SortableTable
              metadata={colLabels}
              initialData={data}
              initialOrder=""
            />
          </TableWrapper>
        </FullScreenTable>
        :
        <TableWrapper
          sx={{
            position:'relative',
            minHeight:'40rem',
            // marginBottom:'2rem'
          }}
          nav={
            <Fab
              title="Open in full windown mode"
              color="primary"
              size="small"
              aria-label="full screen mode"
              onClick={() => setFullScreen(true)}
              sx={{
                position: 'absolute',
                right: '1rem',
                bottom: '1.5rem',
                zIndex: 9
              }}
            >
              <OpenInNewIcon />
            </Fab>
          }
        >
          <SortableTable
            metadata={colLabels}
            initialData={data}
            initialOrder=""
          />
        </TableWrapper>
      }
    </div>
  )
}
