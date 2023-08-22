// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import Button from '@mui/material/Button'
import CancelIcon from '@mui/icons-material/Cancel'
import ErrorIcon from '@mui/icons-material/Error'
import {useState} from 'react'

export default function Announcement({announcement}: {announcement: string | null}) {
  const [open, setOpen] = useState(true)
  if (announcement === null || announcement === undefined) return null

  if (!open) return null

  return (
    <div
      className="fixed bottom-0 right-0 w-full bg-warning text-white font-extrabold flex"
    >
      <div className='my-auto pl-5'>
        <ErrorIcon className='align-middle' />
      </div>
      <div className="w-full p-5 inline-block">
        <span className='align-middle'>{announcement}</span>
      </div>
      <Button
        className='ml-auto'
        onClick={() => {setOpen(false)}}
      >
        <CancelIcon className='text-white' />
      </Button>
    </div>
  )
}
