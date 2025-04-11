// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Fab from '@mui/material/Fab'

import {useSession} from '~/auth'
import ContentLoader from '~/components/layout/ContentLoader'
import NoContent from '~/components/layout/NoContent'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import TableWrapper from './TableWrapper'
import SortableTable from './SortableTable'
import {useProjectQuality} from './apiProjectQuality'
import FullScreenTable from './FullScreenTable'

export default function ProjectQuality() {
  const {token,user} = useSession()
  const [showAll, setShowAll] = useState(user?.role === 'rsd_admin')
  const {realLabels,data,dataLoaded} = useProjectQuality({token,showAll})
  const isAdmin = user?.role === 'rsd_admin'
  const [fullScreen, setFullScreen] = useState(false)

  // console.group('ProjectQuality')
  // console.log('token...', token)
  // console.log('showAll...', showAll)
  // console.log('data...', data)
  // console.log('dataLoaded...', dataLoaded)
  // console.groupEnd()

  function renderContent() {
    if (fullScreen === false) {
      return (
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
            metadata={realLabels}
            initialData={data}
            initialOrder=""
          />
        </TableWrapper>
      )
    }

    return (
      <FullScreenTable
        onClose={() => setFullScreen(false)}
      >
        <TableWrapper
          sx={{
            minHeight: '90vh',
          }}
        >
          <SortableTable
            metadata={realLabels}
            initialData={data}
            initialOrder=""
          />
        </TableWrapper>
      </FullScreenTable>
    )
  }

  if (dataLoaded === false) {
    return (
      <BaseSurfaceRounded
        className="flex-1 flex p-4"
        type="section"
      >
        <ContentLoader />
      </BaseSurfaceRounded>
    )
  }
  // debugger
  if (data.length === 0) {
    return <NoContent />
  }

  return (
    <BaseSurfaceRounded
      className="flex-1 p-4"
      type="section"
    >
      <div className="flex flex-col overflow-hidden">
        <div className="flex justify-end">
          {isAdmin &&
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
          }
        </div>
        {renderContent()}
      </div>
    </BaseSurfaceRounded>
  )
}
