// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'

import {getImageUrl} from '~/utils/editImage'
import {useRouter} from 'next/router'

type UnitListItemProps = {
  pos: number
  slug: string,
  name: string,
  website: string | null,
  logo_id: string | null,
  isMaintainer: boolean
  onEdit: (pos:number)=>void
  // onDelete: (pos: number) => void
}

export default function UnitItem({pos,slug,name,website,logo_id,isMaintainer,onEdit}: UnitListItemProps) {
  const router = useRouter()
  const slugs = []
  if (typeof router.query['slug'] === 'string') {
    slugs.push(router.query['slug'])
    slugs.push(slug)
  } else if (typeof router.query['slug'] === 'object') {
    slugs.push(
      ...router.query['slug'],
      slug
    )
  }

  // console.group('UnitItem')
  // console.log('isMaintainer...', isMaintainer)
  // console.groupEnd()

  function getSecondaryActions() {
    if (isMaintainer) {
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
        // disable hover color change to avoid click confusion
        // '&:hover': {
        //   backgroundColor:'grey.100'
        // }
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
            href={{
              pathname: router.pathname,
              query: {
                slug: slugs
              }
            }}
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
