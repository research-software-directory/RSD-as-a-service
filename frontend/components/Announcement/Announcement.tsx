// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import ErrorIcon from '@mui/icons-material/Error'

export default function Announcement({announcement}: {announcement: string | null}) {
  const [open, setOpen] = useState(true)

  // do not show if no content or close icon is clicked
  if (typeof(announcement) == 'undefined' || announcement === null || open===false) return null

  return (
    <div
      className="flex justify-center items-center fixed bottom-0 right-0 w-full bg-warning text-warning-content text-xl px-4"
    >
      <ErrorIcon/>
      <span className='flex-1 py-8 ml-2'>{announcement}</span>
      <IconButton
        size='large'
        onClick={() => {setOpen(false)}}
        sx={{
          color: 'warning.contrastText'
        }}
      >
        <CancelIcon />
      </IconButton>
    </div>
  )
}
