// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'

import {useSession} from '~/auth/AuthProvider'
import {getImageUrl} from '~/utils/editImage'
import {getDisplayInitials} from '~/utils/getDisplayName'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {RsdContributor} from './useContributors'
import {patchPerson} from './apiRsdContributors'

type AvatarOptionsProps=Readonly<{
  data: RsdContributor
}>

export default function AvatarOptions({data}:AvatarOptionsProps) {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
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

  async function patchAvatar(avatar:string|null){
    // console.log('patchAvatar...', avatar)
    const resp = await patchPerson({
      id: data.id,
      key: 'avatar_id',
      value: avatar,
      origin: data.origin,
      token
    })
    // debugger
    if (resp.status==200){
      // update image

      data.avatar_id = avatar
    }else{
      showErrorMessage(`Failed to update avatar. ${resp?.message ?? ''}`)
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
  if (data.avatars && data.avatars?.length > 0){
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
          {/* LIST avatar options */}
          {data.avatars
            // show all options EXCEPT used one
            .filter(item=>item!==data.avatar_id)
            // render menu options
            .map((item:string)=>{

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
          {/* option to remove avatar */}
          {data.avatar_id!==null ?
            <MenuItem
              data-testid="remove-avatar-option"
              key={data.id}
              onClick={()=>patchAvatar(null)}
            >
              <Avatar
                src=""
                sx={{
                  width: '3rem',
                  height: '3rem',
                  fontSize: '1rem',
                }}
              >
                {displayInitials}
              </Avatar>
            </MenuItem>
            :null
          }
        </Menu>
      </>
    )
  }

  // NO avatar options
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
