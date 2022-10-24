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
        color: 'primary.contrastText',
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
