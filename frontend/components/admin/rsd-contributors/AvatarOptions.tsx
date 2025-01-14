// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

import {useSession} from '~/auth'
import {deleteImage, getImageUrl} from '~/utils/editImage'
import {getDisplayInitials} from '~/utils/getDisplayName'
import {RsdContributor} from './useContributors'
import {patchPerson} from './apiRsdContributors'

type AvatarOptionsProps={
  data: RsdContributor
}

export default function AvatarOptions({data}:Readonly<AvatarOptionsProps>) {
  const {token} = useSession()
  const [anchorEl, setAnchorEl] = useState(null)
  const menu = Boolean(anchorEl)
  const displayInitials = getDisplayInitials({
    given_names: data.given_names,
    family_names: data.family_names
  })
  const avatarUrl = getImageUrl(data.avatar_id) ?? ''

  // console.group('AvatarOptions')
  // console.log('menu...', menu)
  // console.log('avatar_id...', data.avatar_id)
  // console.log('avatars...', data.avatars)
  // console.groupEnd()

  async function patchAvatar(avatar:string){
    // console.log('patchAvatar...', avatar)
    const resp = await patchPerson({
      id: data.id,
      key: 'avatar_id',
      value: avatar,
      origin: data.origin,
      token
    })
    // debugger
    if (resp.status===200){
      // try to remove old avatar image
      if (data.avatar_id){
        deleteImage({
          id: data.avatar_id,
          token
        })
      }
      // update image
      data.avatar_id = avatar
    }
    // NOTE! this will refresh state
    handleClose()
  }

  function handleClick(event:any){
    // debugger
    setAnchorEl(event.currentTarget)
  }
  function handleClose(){
    // debugger
    setAnchorEl(null)
  }

  // menu options to change avatar
  if (data.avatars && data.avatars?.length > 1){
    return (
      <>
        <Badge
          overlap="circular"
          badgeContent={data.avatars?.length ?? 0}
          color="primary"
          showZero
          sx={{
            cursor:'pointer'
          }}
        >
          <IconButton
            data-testid="avatar-options"
            onClick={handleClick}
          >
            <Avatar
              title="Click for avatar options based on name"
              alt={data.family_names ?? 'Unknown'}
              src={avatarUrl ?? ''}
              sx={{
                width: '3rem',
                height: '3rem',
                fontSize: '1rem',
              }}
            >
              {displayInitials}
            </Avatar>
          </IconButton>
        </Badge>
        <Menu
          open={menu}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          {data.avatars
            // show all options EXCEPT used one
            .filter(item=>item!==data.avatar_id)
            // render menu options
            .map((item:string)=>{
              const displayInitials = getDisplayInitials({
                given_names: data.given_names,
                family_names: data.family_names
              })
              const imageUrl = getImageUrl(item) ?? ''
              // debugger
              return (
                <MenuItem
                  data-testid="avatar-menu-option"
                  key={item}
                  onClick={()=>patchAvatar(item)}
                >
                  <Avatar
                    src={imageUrl ?? ''}
                    sx={{
                      width: '3rem',
                      height: '3rem',
                      fontSize: '1rem',
                    }}
                  >
                    {displayInitials}
                  </Avatar>
                </MenuItem>
              )
            })}
        </Menu>
      </>
    )
  }

  // one or NO avatar options
  return (
    <Badge
      overlap="circular"
      badgeContent={data.avatars?.length ?? 0}
      color="primary"
      showZero
    >
      <Avatar
        alt={data.family_names ?? 'Unknown'}
        src={avatarUrl ?? ''}
        sx={{
          width: '3rem',
          height: '3rem',
          fontSize: '1rem',
        }}
      >
        {displayInitials}
      </Avatar>
    </Badge>
  )
}
