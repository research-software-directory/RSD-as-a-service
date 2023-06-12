// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import {RORItem} from '~/utils/getROR'
import UnderlinedTitle from './UnderlinedTitle'

export default function RorType({meta}:{meta:RORItem|null}) {
  try {
    if (meta===null) return null
    return (
      <>
        <UnderlinedTitle title='Type' />
        <div className="flex gap-4 mb-4">
          {meta.types.map(item => (
            <Chip
            key={item}
            label={item}
            sx={{
              maxWidth: '19rem',
              borderRadius: '0rem 0.5rem',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              textTransform: 'uppercase',
              letterSpacing: '0.125rem',
              fontSize:'0.75rem'
            }}
          />
        ))}
        </div>
      </>
    )
  } catch (e) {
    return null
  }
}
