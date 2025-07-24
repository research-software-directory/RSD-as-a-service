// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'

import {useSession} from '~/auth/AuthProvider'
import {MenuItemType} from '~/config/menuItems'
import useUserMenuItems from '~/config/useUserMenuItems'
import {useUserSettings} from '~/config/UserSettingsContext'
import {getDisplayInitials, splitName} from '~/utils/getDisplayName'
import {getImageUrl} from '~/utils/editImage'
import useDisableScrollLock from '~/utils/useDisableScrollLock'
import CaretIcon from '~/components/icons/caret.svg'

export default function UserMenu() {
  const {user} = useSession()
  const {avatar_id} = useUserSettings()
  const disable = useDisableScrollLock()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const menuItems = useUserMenuItems()
  const avatarUrl = getImageUrl(avatar_id)

  // console.group('UserMenu')
  // console.log('avatar_id...', avatar_id)
  // console.log('avatarUrl...', avatarUrl)
  // console.groupEnd()

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose(item: MenuItemType) {
    if (item?.fn) {
      // call function if provided
      item.fn(item)
    }
    setAnchorEl(null)
  }

  function renderMenuOptions() {
    if (menuItems) {
      return (
        menuItems.map(item => {
          if (item?.type === 'divider') {
            return <Divider key={item.label}/>
          }
          if (item.path) {
            return (
              <MenuItem
                data-testid="user-menu-option"
                key={item.label}
                onClick={() => handleClose(item)}
                component = {Link}
                href = {item.path}
                sx = {{
                  ':hover': {
                    color: 'text.primary'
                  }
                }}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {item.label}
              </MenuItem>
            )
          } else {
            return (
              <MenuItem
                data-testid="user-menu-option"
                key={item.label}
                onClick={() => handleClose(item)}
              >
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                {item.label}
              </MenuItem>
            )
          }
        })
      )
    }
  }

  return (
    <>
      <IconButton
        title="My RSD"
        data-testid="user-menu-button"
        aria-controls="user-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : 'false'}
        onClick={handleClick}
        sx={{
          '&:focus-visible': {
            outline: 'auto'
          }
        }}
      >
        <Avatar
          alt={user?.name ?? ''}
          src={avatarUrl ?? ''}
          sx={{
            width: '3rem',
            height: '3rem',
            fontSize: '1rem'
          }}
        >
          {getDisplayInitials(splitName(user?.name ?? ''))}
        </Avatar>
        <CaretIcon className="text-secondary-content ml-2"/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        // disable adding styles to body (overflow:hidden & padding-right)
        disableScrollLock = {disable}
      >
        {renderMenuOptions()}
      </Menu>
    </>
  )
}
