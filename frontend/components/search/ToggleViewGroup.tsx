// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export type ProjectLayoutType = 'list'|'grid'
export type SoftwareLayoutType = 'list'|'grid'|'masonry'

// <T> can be ProjectLayoutType or SoftwareLayoutType
type ToggleLayoutGroupProps <T> = Readonly<{
  view: T
  onChangeView: (view:T)=>void
  options?: SoftwareLayoutType[]
  sx?: any
}>

export default function ToggleViewGroup<T>({
  options=['grid','list'],view,onChangeView,sx
}:ToggleLayoutGroupProps<T>) {
  return (
    <ToggleButtonGroup
      data-testid="card-layout-options"
      orientation="horizontal"
      value={view}
      size="small"
      exclusive
      onChange={(e, view) => onChangeView(view)}
      sx={{
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      {
        options.includes('grid') ?
          <ToggleButton value="grid" aria-label="grid">
            <ViewModuleIcon />
          </ToggleButton>
          : null
      }
      {
        options.includes('list') ?
          <ToggleButton value="list" aria-label="list">
            <ViewListIcon />
          </ToggleButton>
          : null
      }
      {
        options.includes('masonry') ?
          <ToggleButton value="masonry" aria-label="masonry">
            <ViewQuiltIcon />
          </ToggleButton>
          : null
      }
    </ToggleButtonGroup>
  )
}
