// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import {useRouter} from 'next/router'

type EditButtonProps = {
  title: string,
  url:string
}

export default function EditButton({title,url}:EditButtonProps) {
  const router = useRouter()
  return (
    <IconButton
      size="large"
      title={title}
      data-testid="edit-button"
      aria-label={title}
      onClick={() => {
        router.push(url)
      }}
      sx={{
        color: '#ffffff', // Fix for Helmholtz Design
        margin:'0rem 0.5rem',
        '&:hover': {
          color: 'primary.main'
        },
        alignSelf: 'center',
        '&:focus-visible': {
          outline: 'auto'
        }
      }}
    >
      <EditIcon />
    </IconButton>
  )
}
