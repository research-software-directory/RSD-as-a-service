// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0
'use client'

import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

import {SvgIconComponent} from '@mui/icons-material'

export type LayoutType = 'list'|'grid'|'masonry'

type LayoutTypeIcons = {
  [K in LayoutType]: SvgIconComponent
}

type ViewToggleGroupProps<T extends LayoutType = LayoutType> = {
  layout: T
  onSetView: (view:T)=>void
  sx?: any
  layoutOptions?: T[]
}

export default function ViewToggleGroup<T extends LayoutType = LayoutType>({layout,onSetView,sx, layoutOptions}:ViewToggleGroupProps<T>) {
  const layoutTypeIcons: LayoutTypeIcons = {
    list: ViewListIcon,
    grid: ViewModuleIcon,
    masonry: ViewQuiltIcon
  }

  const optionsToRender: T[] =
  layoutOptions ?? (Object.keys(layoutTypeIcons) as T[])

  return (
    <ToggleButtonGroup
      data-testid="card-layout-options"
      orientation="horizontal"
      value={layout}
      size="small"
      exclusive
      onChange={(e, view) => onSetView(view)}
      sx={{
        backgroundColor: 'background.paper',
        ...sx
      }}
    >
      { optionsToRender.map((option) => {
          const LayoutIcon = layoutTypeIcons[option] as React.ElementType
          return (
            <ToggleButton key={option} value={option} aria-label={option}>
              <LayoutIcon />
            </ToggleButton>
          )
        })
      }
    </ToggleButtonGroup>
  )
}
