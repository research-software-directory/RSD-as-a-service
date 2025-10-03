// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useRouter} from 'next/navigation'
import Fab from '@mui/material/Fab'
import EditIcon from '@mui/icons-material/Edit'

type EditFabProps = {
  title: string
  url: string
}

export default function EditFab({title, url}: EditFabProps) {
  const router = useRouter()
  return (
    <Fab
      title={title}
      color="primary"
      aria-label={title}
      onClick={() => {
        router.push(url)
      }}
      sx={{
        position: 'absolute',
        zIndex: 9,
        top: {
          xs: '1rem',
          // sm: '1rem',
          // md: '1rem',
          // lg: '1rem',
          // xl: '1rem'
        },
        right: {
          xs: '1rem',
          // md: '2.5rem',
          // lg: '2.5rem'
        }
      }}
    >
      <EditIcon />
    </Fab>
  )
}
