// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Chip from '@mui/material/Chip'
import SearchIcon from '@mui/icons-material/Search'
import Link from 'next/link'

export default function TagChipFilter({url, label, title}:
  {label: string, url?:string ,title?: string }
){
  // if no label no chip
  if (!label) return null

  // simple chip without link
  if (!url) return (
    <Chip
      title={title ? title : label}
      label={label}
      sx={{
        maxWidth: '19rem',
        borderRadius: '0.125rem',
        textTransform: 'capitalize',
        '& .MuiChip-icon': {
          order: 1,
          margin:'0rem 0.5rem 0rem 0rem',
          height: '1.125rem',
          width: '1.125rem'
        }
      }}
    />
  )

  return (
    <Link
      href={url}
      passHref
    >
      <Chip
        title={`Click to filter for ${title ? title : label}`}
        label={label}
        icon={<SearchIcon />}
        clickable
        sx={{
          maxWidth: '19rem',
          borderRadius: '0.125rem',
          textTransform: 'capitalize',
          '& .MuiChip-icon': {
            order: 1,
            margin:'0rem 0.5rem 0rem 0rem',
            height: '1.125rem',
            width: '1.125rem'
          }
        }}
      />
    </Link>
  )
}
