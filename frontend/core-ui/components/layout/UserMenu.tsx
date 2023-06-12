// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import router from 'next/router'
import {useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'

import {useAuth} from '../../auth/index'
import {MenuItemType} from '../../config/menuItems'
import {getDisplayInitials, splitName} from '../../utils/getDisplayName'
import CaretIcon from '~/components/icons/caret.svg'
import useDisableScrollLock from '~/utils/useDisableScrollLock'

type UserMenuType = {
  image?: string
  menuOptions?: MenuItemType[]
}

export default function UserMenu(props: UserMenuType) {
  const {session} = useAuth()
  const disable = useDisableScrollLock()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const {menuOptions} = props

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose(item: MenuItemType) {
    if (item?.fn) {
      // call function if provided
      item.fn(item)
    } else if (item?.path) {
      // push to route if provided
      router.push(item.path)
    }
    setAnchorEl(null)
  }

  function renderMenuOptions() {
    if (menuOptions) {
      return (
        menuOptions.map(item => {
          if (item?.type === 'divider') {
            return <Divider key={item.label}/>
          }
          return (
            <MenuItem
              data-testid="user-menu-option"
              key={item.label}
              onClick={() => handleClose(item)}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              {item.label}
            </MenuItem>
          )
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
          alt={session?.user?.name ?? ''}
          src={''}
          sx={{
            width: '3rem',
            height: '3rem',
            fontSize: '1rem'
          }}
        >
          {getDisplayInitials(splitName(session?.user?.name ?? ''))}
        </Avatar>
        <CaretIcon className="text-secondary-content ml-2"/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'menu-button',
        }}
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
