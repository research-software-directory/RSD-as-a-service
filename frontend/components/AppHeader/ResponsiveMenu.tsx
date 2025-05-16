// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState, MouseEvent} from 'react'
import Link from 'next/link'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'

import useDisableScrollLock from '~/utils/useDisableScrollLock'
import useMenuItems from '~/config/useMenuItems'
import isActiveMenuItem from './isActiveMenuItem'

export default function ResponsiveMenu({activePath}:{activePath:string}) {
  const menuItems = useMenuItems()
  const disable = useDisableScrollLock()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  // console.group('ResponsiveMenu')
  // console.log('disable...',disable)
  // console.log('open...',open)
  // console.groupEnd()

  function handleClickResponsiveMenu(event: MouseEvent<HTMLButtonElement>){
    setAnchorEl(event.currentTarget)
  }

  function handleCloseResponsiveMenu(){
    setAnchorEl(null)
  }

  return (
    <div className="flex items-center lg:hidden">
      <IconButton
        size="large"
        title="Menu"
        data-testid="menu-button"
        aria-label="menu button"
        onClick={handleClickResponsiveMenu}
        sx={{
          color: 'primary.contrastText',
          alignSelf: 'center',
          '&:focus-visible': {
            outline: 'auto'
          }
        }}
      >
        <MenuIcon/>
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseResponsiveMenu}
        transformOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        // disable adding styles to body (overflow:hidden & padding-right)
        disableScrollLock = {disable}
      >
        {menuItems.map(item => {
          const isActive = isActiveMenuItem({item, activePath})
          return (
            <Link
              key={item.path}
              href={item.path ?? ''}
            >
              <MenuItem
                key={item.path}
                onClick={handleCloseResponsiveMenu}
                selected={isActive}
              >
                {item.label}
              </MenuItem>
            </Link>
          )
        })}
      </Menu>
    </div>
  )
}
