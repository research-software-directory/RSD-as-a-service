// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import Chip from '@mui/material/Chip'
import SearchIcon from '@mui/icons-material/Search'
import CircularProgress from '@mui/material/CircularProgress'

type TagChipFilterProps=Readonly<{
  label: string,
  url?:string ,
  title?: string
  capitalize?: boolean
  loading?: boolean
}>

export default function TagChipFilter({
  url, label,
  title, capitalize=true,
  loading
}:TagChipFilterProps){
  // if no label no chip
  if (!label) return null

  if (loading) return (
    <Chip
      title={title ?? label}
      label={label}
      icon={<div className="noscript:hidden"><CircularProgress size={16} /></div>}
      sx={{
        maxWidth: '19rem',
        borderRadius: '0.125rem',
        textTransform: capitalize ? 'capitalize' : 'none',
        '& .MuiChip-icon': {
          order: 1,
          margin:'0.5rem',
        }
      }}
    />
  )

  // simple chip without link
  if (!url) return (
    <Chip
      title={title ?? label}
      label={label}
      sx={{
        maxWidth: '19rem',
        borderRadius: '0.125rem',
        textTransform: capitalize ? 'capitalize' : 'none',
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
          textTransform: capitalize ? 'capitalize' : 'none',
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
