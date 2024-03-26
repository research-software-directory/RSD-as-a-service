// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import AddIcon from '@mui/icons-material/Add'

import {useSession} from '~/auth'

export default function AddNewsButton() {
  const {user} = useSession()

  if (user && user?.role==='rsd_admin'){
    return (
      <IconButton
        title="Add news item"
        aria-label='Add news item'
        href='/news/add'
        // onClick={()=>setOpen(true)}
        sx={{margin:'0rem 0.5rem'}}
      >
        <AddIcon />
      </IconButton>
    )
  }

  return null
}
