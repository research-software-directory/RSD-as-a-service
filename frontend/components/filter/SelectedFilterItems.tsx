// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import {Fragment} from 'react'

type SelectedFilterItemsProps = {
  items: string[]
  onDelete: (pos:number)=>void
}

export default function SelectedFilterItems({items=[], onDelete}: SelectedFilterItemsProps) {
  if (items.length===0) return null
  return (
    <section className="flex flex-wrap items-center px-4 pb-4 gap-2">
      {items.map((item, pos) => {
        if (pos > 0) {
          return (
            <Fragment key={pos}>
              <span className="text-md">+</span>
              <Chip
                data-testid="filter-item-chip"
                title={item}
                label={item}
                onDelete={() => onDelete(pos)}
                sx={{
                  borderRadius:'0.25rem'
                }}
              />
            </Fragment>
          )
        }
        return (
          <Chip
            data-testid="filter-item-chip"
            title={item}
            key={pos}
            label={item}
            onDelete={() => onDelete(pos)}
            sx={{
              borderRadius:'0.25rem'
            }}
          />
        )
      })}
    </section>
  )
}
