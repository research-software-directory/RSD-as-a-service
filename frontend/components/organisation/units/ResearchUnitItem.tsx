// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {usePathname} from 'next/navigation'
import Link from 'next/link'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import {getImageUrl} from '~/utils/editImage'

type UnitListItemProps = Readonly<{
  pos: number
  slug: string,
  name: string,
  website: string | null,
  logo_id: string | null,
  isPrimaryMaintainer: boolean
  onEdit: (pos:number)=>void
}>

export default function UnitItem({pos,slug,name,website,logo_id,isPrimaryMaintainer,onEdit}: UnitListItemProps) {
  const pathname = usePathname()
  const url = `${pathname}/${slug}`

  // console.group('UnitItem')
  // console.log('isPrimaryMaintainer...', isPrimaryMaintainer)
  // console.log('slug...', slug)
  // console.log('name...', name)
  // console.log('url...', url)
  // console.groupEnd()

  function getSecondaryActions() {
    if (isPrimaryMaintainer) {
      return (
        <>
          <IconButton
            edge="end"
            aria-label="edit"
            sx={{marginRight: '1rem'}}
            onClick={() => {
              onEdit(pos)
            }}
          >
            <EditIcon />
          </IconButton>
        </>
      )
    }
  }

  function getSecondaryLabel(){
    if (website) {
      return (
        <>
          <span>
            <a href={website} target="_blank" rel="noreferrer">{website}</a>
          </span>
        </>
      )
    }
    return null
  }

  return (
    <ListItem
      data-testid="research-unit-item"
      secondaryAction={getSecondaryActions()}
      sx={{
        // this makes space for buttons
        paddingRight: '7.5rem',
      }}
    >
      <ListItemAvatar>
        <Avatar
          alt={name}
          src={getImageUrl(logo_id) ?? undefined}
          sx={{
            width: '4rem',
            height: '4rem',
            fontSize: '1.5rem',
            marginRight: '1rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {name.slice(0,3)}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Link
            href={url}
            passHref
          >
            {name}
          </Link>
        }
        secondary={getSecondaryLabel()}
      />
    </ListItem>
  )
}
